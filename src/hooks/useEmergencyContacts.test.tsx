import { renderHook, act, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useEmergencyContacts, type EmergencyContact } from "./useEmergencyContacts";

const toastSpy = vi.fn();

vi.mock("@/components/ui/use-toast", () => ({
  toast: (args: unknown) => {
    toastSpy(args);
  },
}));

let contactsStore: EmergencyContact[] = [];
let idCounter = 0;

const cloneContact = (contact: EmergencyContact): EmergencyContact => ({
  ...contact,
});

const createRow = (
  overrides: Partial<EmergencyContact> &
    Pick<EmergencyContact, "name" | "phone"> & { user_id: string }
): EmergencyContact => {
  const timestamp = new Date().toISOString();
  return {
    id: overrides.id ?? `contact-${++idCounter}`,
    user_id: overrides.user_id,
    name: overrides.name,
    phone: overrides.phone,
    email: overrides.email ?? null,
    relationship: overrides.relationship ?? null,
    notes: overrides.notes ?? null,
    is_primary: overrides.is_primary ?? false,
    priority_order: overrides.priority_order ?? null,
    created_at: overrides.created_at ?? timestamp,
    updated_at: overrides.updated_at ?? timestamp,
  };
};

const sortContactsLocally = (userId: string | null) => {
  const filtered = contactsStore.filter((contact) =>
    userId ? contact.user_id === userId : true
  );

  return [...filtered].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;

    const aOrder = a.priority_order ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.priority_order ?? Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) return aOrder - bOrder;
    return (
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  });
};

const createUpdateChain = (payload: Partial<EmergencyContact>) => {
  let targetId: string | null = null;
  let userIdFilter: string | null = null;

  const applyUpdate = () => {
    contactsStore = contactsStore.map((contact) => {
      const matchesId = targetId ? contact.id === targetId : true;
      const matchesUser = userIdFilter
        ? contact.user_id === userIdFilter
        : true;

      if (matchesId && matchesUser) {
        return {
          ...contact,
          ...payload,
          updated_at: new Date().toISOString(),
        };
      }

      return contact;
    });

    return Promise.resolve({ error: null });
  };

  const chain: { eq: (column: string, value: string) => any } = {
    eq: vi.fn((column: string, value: string) => {
      if (column === "id") {
        targetId = value;
        return chain;
      }

      if (column === "user_id") {
        userIdFilter = value;
        return applyUpdate();
      }

      return chain;
    }),
  };

  return chain;
};

const createDeleteChain = () => {
  let targetId: string | null = null;

  const chain: { eq: (column: string, value: string) => any } = {
    eq: vi.fn((column: string, value: string) => {
      if (column === "id") {
        targetId = value;
        return chain;
      }

      if (column === "user_id") {
        contactsStore = contactsStore.filter(
          (contact) => !(contact.id === targetId && contact.user_id === value)
        );
        return Promise.resolve({ error: null });
      }

      return chain;
    }),
  };

  return chain;
};

const createQueryBuilder = () => {
  let selectUserId: string | null = null;
  let orderCount = 0;

  const builder: Record<string, any> = {
    select: vi.fn(() => builder),
    eq: vi.fn((column: string, value: string) => {
      if (column === "user_id") {
        selectUserId = value;
      }
      return builder;
    }),
    order: vi.fn(() => {
      orderCount += 1;
      if (orderCount < 2) {
        return builder;
      }

      const data = sortContactsLocally(selectUserId);
      return Promise.resolve({ data, error: null });
    }),
    insert: vi.fn((payload: Partial<EmergencyContact>) => ({
      select: vi.fn(() => ({
        single: vi.fn(() => {
          const targetUserId =
            (payload.user_id as string | null) ?? selectUserId;

          if (!targetUserId) {
            return Promise.resolve({ data: null, error: null });
          }

          const newRow = createRow({
            ...payload,
            user_id: targetUserId,
            name: payload.name ?? "Unnamed",
            phone: payload.phone ?? "",
          });

          contactsStore.push(newRow);
          return Promise.resolve({ data: newRow, error: null });
        }),
      })),
    })),
    update: vi.fn((payload: Partial<EmergencyContact>) =>
      createUpdateChain(payload)
    ),
    delete: vi.fn(() => createDeleteChain()),
  };

  return builder;
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => {
      if (table !== "emergency_contacts") {
        throw new Error(`Unexpected table: ${table}`);
      }
      return createQueryBuilder();
    },
  },
}));

const seedContacts = (rows: EmergencyContact[]) => {
  contactsStore = rows.map(cloneContact);
};

afterEach(() => {
  toastSpy.mockClear();
});

beforeEach(() => {
  contactsStore = [];
  idCounter = 0;
});

describe("useEmergencyContacts", () => {
  it("loads contacts sorted by primary and priority", async () => {
    const baseTimestamp = "2024-01-01T00:00:00.000Z";

    seedContacts([
      {
        id: "one",
        user_id: "user-1",
        name: "Charlie",
        phone: "555-1000",
        email: null,
        relationship: null,
        notes: null,
        is_primary: false,
        priority_order: 2,
        created_at: new Date("2024-01-03T00:00:00.000Z").toISOString(),
        updated_at: baseTimestamp,
      },
      {
        id: "two",
        user_id: "user-1",
        name: "Alpha",
        phone: "555-2000",
        email: null,
        relationship: null,
        notes: null,
        is_primary: true,
        priority_order: 3,
        created_at: new Date("2024-01-01T00:00:00.000Z").toISOString(),
        updated_at: baseTimestamp,
      },
      {
        id: "three",
        user_id: "user-1",
        name: "Bravo",
        phone: "555-3000",
        email: null,
        relationship: null,
        notes: null,
        is_primary: false,
        priority_order: 1,
        created_at: new Date("2024-01-02T00:00:00.000Z").toISOString(),
        updated_at: baseTimestamp,
      },
    ]);

    const { result } = renderHook(() => useEmergencyContacts("user-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.contacts.map((contact) => contact.id)).toEqual([
      "two",
      "three",
      "one",
    ]);
  });

  it("reorders contacts and persists priority changes", async () => {
    seedContacts([
      createRow({
        id: "a",
        user_id: "user-1",
        name: "First",
        phone: "555-0001",
        priority_order: 0,
        is_primary: true,
      }),
      createRow({
        id: "b",
        user_id: "user-1",
        name: "Second",
        phone: "555-0002",
        priority_order: 1,
      }),
      createRow({
        id: "c",
        user_id: "user-1",
        name: "Third",
        phone: "555-0003",
        priority_order: 2,
      }),
    ]);

    const { result } = renderHook(() => useEmergencyContacts("user-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.reorderContact("c", "up");
    });

    expect(result.current.contacts.map((contact) => contact.id)).toEqual([
      "a",
      "c",
      "b",
    ]);

    const updatedPriorities = contactsStore
      .filter((contact) => contact.user_id === "user-1")
      .map((contact) => ({ id: contact.id, priority: contact.priority_order }))
      .sort((left, right) => (left.priority ?? 0) - (right.priority ?? 0));

    expect(updatedPriorities).toEqual([
      { id: "a", priority: 0 },
      { id: "c", priority: 1 },
      { id: "b", priority: 2 },
    ]);
  });

  it("sets a single primary contact per user", async () => {
    seedContacts([
      createRow({
        id: "primary",
        user_id: "user-1",
        name: "Primary",
        phone: "555-1111",
        is_primary: true,
        priority_order: 0,
      }),
      createRow({
        id: "secondary",
        user_id: "user-1",
        name: "Secondary",
        phone: "555-2222",
        priority_order: 1,
      }),
    ]);

    const { result } = renderHook(() => useEmergencyContacts("user-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.setPrimaryContact("secondary");
    });

    const primaryStatuses = result.current.contacts.map((contact) => ({
      id: contact.id,
      primary: contact.is_primary,
    }));

    expect(primaryStatuses).toEqual([
      { id: "secondary", primary: true },
      { id: "primary", primary: false },
    ]);

    const storedPrimaries = contactsStore
      .filter((contact) => contact.user_id === "user-1")
      .map((contact) => ({ id: contact.id, primary: contact.is_primary }));

    expect(
      storedPrimaries.sort((left, right) => left.id.localeCompare(right.id))
    ).toEqual([
      { id: "primary", primary: false },
      { id: "secondary", primary: true },
    ]);
  });
});
