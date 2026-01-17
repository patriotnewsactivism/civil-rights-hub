import uuid
import random
import datetime

# --- DATA ---

STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
]

CITIES = {
    "Alabama": ["Birmingham", "Montgomery", "Mobile", "Huntsville"],
    "Alaska": ["Anchorage", "Fairbanks", "Juneau"],
    "Arizona": ["Phoenix", "Tucson", "Mesa", "Chandler"],
    "Arkansas": ["Little Rock", "Fort Smith", "Fayetteville"],
    "California": ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland"],
    "Colorado": ["Denver", "Colorado Springs", "Aurora", "Fort Collins"],
    "Connecticut": ["Bridgeport", "New Haven", "Stamford", "Hartford"],
    "Delaware": ["Wilmington", "Dover", "Newark"],
    "Florida": ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg"],
    "Georgia": ["Atlanta", "Augusta", "Columbus", "Macon"],
    "Hawaii": ["Honolulu", "Hilo", "Kailua"],
    "Idaho": ["Boise", "Meridian", "Nampa"],
    "Illinois": ["Chicago", "Aurora", "Naperville", "Joliet"],
    "Indiana": ["Indianapolis", "Fort Wayne", "Evansville"],
    "Iowa": ["Des Moines", "Cedar Rapids", "Davenport"],
    "Kansas": ["Wichita", "Overland Park", "Kansas City"],
    "Kentucky": ["Louisville", "Lexington", "Bowling Green"],
    "Louisiana": ["New Orleans", "Baton Rouge", "Shreveport"],
    "Maine": ["Portland", "Lewiston", "Bangor"],
    "Maryland": ["Baltimore", "Frederick", "Rockville"],
    "Massachusetts": ["Boston", "Worcester", "Springfield"],
    "Michigan": ["Detroit", "Grand Rapids", "Warren"],
    "Minnesota": ["Minneapolis", "St. Paul", "Rochester"],
    "Mississippi": ["Jackson", "Gulfport", "Southaven"],
    "Missouri": ["Kansas City", "St. Louis", "Springfield"],
    "Montana": ["Billings", "Missoula", "Great Falls"],
    "Nebraska": ["Omaha", "Lincoln", "Bellevue"],
    "Nevada": ["Las Vegas", "Henderson", "Reno"],
    "New Hampshire": ["Manchester", "Nashua", "Concord"],
    "New Jersey": ["Newark", "Jersey City", "Paterson"],
    "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho"],
    "New York": ["New York City", "Buffalo", "Rochester", "Yonkers"],
    "North Carolina": ["Charlotte", "Raleigh", "Greensboro"],
    "North Dakota": ["Fargo", "Bismarck", "Grand Forks"],
    "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo"],
    "Oklahoma": ["Oklahoma City", "Tulsa", "Norman"],
    "Oregon": ["Portland", "Salem", "Eugene"],
    "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown"],
    "Rhode Island": ["Providence", "Warwick", "Cranston"],
    "South Carolina": ["Charleston", "Columbia", "North Charleston"],
    "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen"],
    "Tennessee": ["Nashville", "Memphis", "Knoxville"],
    "Texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
    "Utah": ["Salt Lake City", "West Valley City", "Provo"],
    "Vermont": ["Burlington", "South Burlington", "Rutland"],
    "Virginia": ["Virginia Beach", "Norfolk", "Chesapeake"],
    "Washington": ["Seattle", "Spokane", "Tacoma"],
    "West Virginia": ["Charleston", "Huntington", "Morgantown"],
    "Wisconsin": ["Milwaukee", "Madison", "Green Bay"],
    "Wyoming": ["Cheyenne", "Casper", "Laramie"]
}

FIRST_NAMES = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Christopher", "Daniel", "Paul", "Mark", "Donald", "George", "Kenneth", "Steven", "Edward", "Brian", "Ronald", "Anthony", "Kevin", "Jason", "Matthew", "Gary", "Timothy", "Jose", "Larry", "Jeffrey", "Frank", "Scott", "Eric", "Stephen", "Andrew", "Raymond", "Gregory", "Joshua", "Jerry", "Dennis", "Walter", "Patrick", "Peter", "Harold", "Douglas", "Henry", "Carl", "Arthur", "Ryan", "Roger"]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey"]

PRACTICE_AREAS = ["Civil Rights", "Police Misconduct", "Constitutional Law", "First Amendment", "Employment Discrimination", "Wrongful Conviction", "Prisoners' Rights", "Voting Rights", "Housing Discrimination"]
SPECIALTIES = ["Excessive Force", "False Arrest", "Illegal Search", "Malicious Prosecution", "Qualified Immunity", "Section 1983", "Protest Defense", "Police Brutality", "Racial Profiling"]
ACTIVIST_PLATFORMS = ["YouTube", "TikTok", "Facebook", "Instagram", "Twitter/X", "Twitch"]
ACTIVIST_FOCUS = ["First Amendment Audits", "Cop Watching", "Police Accountability", "Public Records", "Government Transparency", "Civil Rights Education"]

VIOLATION_TITLES = [
    "Unlawful detention at traffic stop", "Denied right to record in public", "Excessive force during arrest", "Refusal to identify", "Illegal search of vehicle", "Intimidation for filming", "Denied FOIA request unlawfully", "Retaliation for filing complaint", "Unconstitutional checkpoint", "Harassment of homeless individual"
]
VIOLATION_DESCRIPTIONS = [
    "Officer escalated a routine stop and detained me without articulating a crime.",
    "Was told I couldn't film from a public sidewalk. Officer threatened arrest.",
    "Officer used a taser on a compliant subject who was already handcuffed.",
    "Refused to provide name and badge number when asked multiple times.",
    "Searched my trunk without consent or probable cause.",
    "Followed me for blocks after I filmed them leaving the station.",
    "City clerk claimed public budget documents were 'private' and refused access.",
    "Received a citation for 'loitering' immediately after filing a misconduct complaint.",
    "Stopped at a checkpoint that didn't follow standardized procedures.",
    "Officer destroyed personal property of a homeless person during a sweep."
]

SOCIAL_POST_CONTENTS = [
    "Just finished a public records audit at City Hall. They were surprisingly helpful today!",
    "Does anyone have a good contact for a civil rights lawyer in Texas? Need help with a false arrest case.",
    "New video is up! Documenting the lack of transparency at the local precinct.",
    "Know your rights: You do not have to answer questions if you are not detained.",
    "Can't believe the city council voted to increase the surveillance budget again.",
    "Looking for other activists in the Chicago area to organize a cop watch event.",
    "Huge victory today! The charges against the protesters were dropped.",
    "Reminder: Always film the police. It's your First Amendment right.",
    "Has anyone successfully sued for a FOIA violation in Florida? Looking for advice.",
    "Stay safe out there everyone. Use the buddy system when filming."
]

# --- HELPER FUNCTIONS ---

def escape_sql(text):
    if text is None:
        return "NULL"
    return "'" + text.replace("'", "''") + "'"

def random_date(start_year=2020, end_year=2025):
    start_date = datetime.date(start_year, 1, 1)
    end_date = datetime.date(end_year, 12, 31)
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + datetime.timedelta(days=random_number_of_days)
    return random_date.isoformat()

def random_coords():
    # Roughly continental US
    lat = random.uniform(25.0, 48.0)
    lon = random.uniform(-125.0, -70.0)
    return lat, lon

# --- GENERATORS ---

def generate_attorneys(count=200):
    sql = []
    for _ in range(count):
        fname = random.choice(FIRST_NAMES)
        lname = random.choice(LAST_NAMES)
        name = f"{fname} {lname}"
        state = random.choice(STATES)
        city = random.choice(CITIES.get(state, ["Unknown"]))
        firm = f"Law Offices of {name}"
        phone = f"{random.randint(200, 999)}-{random.randint(200, 999)}-{random.randint(1000, 9999)}"
        email = f"info@{lname.lower()}law.com"
        website = f"https://www.{(lname + fname).lower()}law.com"
        bar_num = f"{state[:2].upper()}-{random.randint(10000, 99999)}"
        exp = random.randint(5, 40)
        practice = random.sample(PRACTICE_AREAS, k=random.randint(1, 3))
        specs = random.sample(SPECIALTIES, k=random.randint(1, 3))
        
        # Array formatting for SQL
        # Use replace("'", "''") directly here since we are wrapping in single quotes
        practice_sql = "ARRAY[" + ", ".join([f"'{p.replace("'", "''")}'" for p in practice]) + "]"
        specs_sql = "ARRAY[" + ", ".join([f"'{s.replace("'", "''")}'" for s in specs]) + "]"

        sql.append(f"""
        INSERT INTO public.attorneys (name, firm, state, city, practice_areas, specialties, phone, email, website, accepts_pro_bono, bar_number, years_experience)
        VALUES ({escape_sql(name)}, {escape_sql(firm)}, {escape_sql(state)}, {escape_sql(city)}, {practice_sql}, {specs_sql}, {escape_sql(phone)}, {escape_sql(email)}, {escape_sql(website)}, {str(random.choice([True, False])).lower()}, {escape_sql(bar_num)}, {exp})
        ON CONFLICT (name, phone) DO NOTHING;
        """)
    return "\n".join(sql)

def generate_activists(count=200):
    sql = []
    for _ in range(count):
        fname = random.choice(FIRST_NAMES)
        lname = random.choice(LAST_NAMES)
        name = f"{fname} {lname}"
        alias = f"{fname}Audits" if random.random() > 0.5 else None
        state = random.choice(STATES)
        platform = random.choice(ACTIVIST_PLATFORMS)
        url = f"https://{platform.lower()}.com/{fname.lower()}{lname.lower()}"
        focus = random.sample(ACTIVIST_FOCUS, k=random.randint(1, 3))
        
        # Correctly escape array elements
        focus_sql = "ARRAY[" + ", ".join([f"'{f.replace("'", "''")}'" for f in focus]) + "]"
        
        sql.append(f"""
        INSERT INTO public.activists (name, alias, home_state, primary_platform, channel_url, focus_areas, verified)
        VALUES ({escape_sql(name)}, {escape_sql(alias)}, {escape_sql(state)}, {escape_sql(platform)}, {escape_sql(url)}, {focus_sql}, {str(random.choice([True, False])).lower()})
        ON CONFLICT DO NOTHING;
        """)
    return "\n".join(sql)

def generate_users_and_activity(user_count=50, violation_count=100):
    sql = []
    user_ids = []
    
    # 1. Generate Users (Profiles)
    # Note: In a real Supabase setup, users are in auth.users. 
    # We can insert into public.user_profiles if the id exists, but we can't easily fake auth.users from a migration 
    # without a specific function or unless we just use UUIDs and hope the app handles "ghost" users gracefully for public data.
    # The schemas link to auth.users.
    # STRATEGY: We will create a few "system" users or just use random UUIDs.
    # Most public tables (posts, violations) link to user_id but RLS might act up if the user doesn't exist in auth.users.
    # However, for seeding public data (like violations/posts) that EVERYONE can see, it might be fine if the FK doesn't restrict strictly or if we are just inserting data.
    # Looking at schema: user_id UUID references auth.users(id). We cannot insert into auth.users from here usually.
    # ALTERNATIVE: Use the existing user ID from the session or a known one, or assume the constraints are soft.
    # Actually, often migrations CANNOT insert into auth.users.
    # So we will create "Anonymous" style records where allowed, or we reuse a set of generated UUIDs 
    # and assume the user will create them or we just accept they are "historical" data.
    # Let's try to fetch a real user ID if possible? No, we are in a migration.
    
    # Workaround: We will insert into tables where user_id is nullable or we will use a hardcoded "System/Seeder" UUID 
    # that we pretend exists. OR we just generate UUIDs and hope constraints don't explode (they will if FK exists).
    
    # Check violations table: user_id is nullable? 
    # Migration 20251115...: user_id UUID REFERENCES auth.users(id).
    # If it's nullable, we can use NULL for "Legacy/Imported".
    # Migration says: user_id UUID REFERENCES auth.users(id) ... usually nullable unless specified NOT NULL.
    # Let's check `violations` table definition in `20251115090003_seed_violations.sql`... actually that was an INSERT.
    # Let's assume user_id can be NULL for imported/historical data.
    
    # For Posts/Comments, we really want user profiles.
    # A common trick is to insert a "Ghost User" into public.user_profiles with a random UUID, 
    # but the FK to auth.users will fail if enforced.
    # So we will mostly stick to NULL user_ids for "historical" data or "Anonymous" where allowed.
    
    # Checking existing `seed_violations.sql`:
    # INSERT INTO public.violations (user_id, ...) VALUES (NULL, ...)
    # So NULL is allowed! Excellent.
    
    # For SOCIAL features (posts), usually user_id is required.
    # `20251117000001_create_enhanced_social_feed_tables.sql`:
    # CREATE TABLE public.posts ( ... user_id UUID NOT NULL REFERENCES auth.users(id) ... )
    # Damn. REQUIRED.
    # We cannot seed posts without valid auth.users.
    # UNLESS: We assume the user running the app will create them.
    # OR: We create a helper function in SQL that "mocks" a user if we are in a local dev environment?
    # No, Supabase auth schema is protected.
    
    # PLAN B for Social: We can only seed social content if we have a valid user.
    # Since I cannot create auth users from migration SQL easily, I will SKIP seeding `posts` and `comments` 
    # for now to avoid FK violations, UNLESS I can find a way to get a valid user ID.
    # I can query `auth.users` in the DO block? Yes!
    
    sql.append("""
    DO $$
    DECLARE
        v_user_id UUID;
        v_violation_id UUID;
        v_lat DECIMAL;
        v_lon DECIMAL;
    BEGIN
        -- Try to get ANY user to attribute seeds to (e.g. the admin/developer)
        SELECT id INTO v_user_id FROM auth.users LIMIT 1;
        
        -- If no user exists, we cannot seed strictly user-bound content (posts), 
        -- but we can seed violations (user_id nullable).
        
        -- Seed Violations
        IF v_user_id IS NOT NULL OR TRUE THEN -- We can always seed violations with NULL user_id
            -- Generated Violations
    """)
    
    for _ in range(violation_count):
        title = random.choice(VIOLATION_TITLES)
        desc = random.choice(VIOLATION_DESCRIPTIONS)
        state = random.choice(STATES)
        city = random.choice(CITIES.get(state, ["Unknown"]))
        lat, lon = random_coords()
        date = random_date()
        
        sql.append(f"""
            INSERT INTO public.violations (title, description, location_state, location_city, incident_date, latitude, longitude, status, user_id)
            VALUES ({escape_sql(title)}, {escape_sql(desc)}, {escape_sql(state)}, {escape_sql(city)}, {escape_sql(date)}, {lat}, {lon}, 'verified', v_user_id);
        """)

    sql.append("""
        END IF;

        -- Seed Social Posts (Only if we have a user)
        IF v_user_id IS NOT NULL THEN
    """)
    
    for _ in range(50): # 50 social posts
        content = random.choice(SOCIAL_POST_CONTENTS)
        sql.append(f"""
            INSERT INTO public.posts (user_id, content, type, visibility)
            VALUES (v_user_id, {escape_sql(content)}, 'text', 'public');
        """)
        
    sql.append("""
        END IF;
    END $$;
    """)
    
    return "\n".join(sql)

# --- MAIN ---

def main():
    output_file = "supabase/migrations/20260118000000_mega_seed_expansion.sql"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("-- MEGA SEED MIGRATION - GENERATED BY SCRIPT\n")
        f.write("-- Contains attorneys, activists, and sample violations\n\n")
        
        f.write("-- 1. ATTORNEYS\n")
        f.write(generate_attorneys(300))
        f.write("\n\n")
        
        f.write("-- 2. ACTIVISTS\n")
        f.write(generate_activists(200))
        f.write("\n\n")
        
        f.write("-- 3. VIOLATIONS AND SOCIAL\n")
        f.write(generate_users_and_activity(50, 100))
        
    print(f"Successfully wrote migration to {output_file}")

if __name__ == "__main__":
    main()
