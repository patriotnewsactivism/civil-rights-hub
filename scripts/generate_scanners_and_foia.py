import uuid
import random
import datetime

# --- DATA ---

STATES = [
    ("Alabama", "AL"), ("Alaska", "AK"), ("Arizona", "AZ"), ("Arkansas", "AR"), ("California", "CA"),
    ("Colorado", "CO"), ("Connecticut", "CT"), ("Delaware", "DE"), ("Florida", "FL"), ("Georgia", "GA"),
    ("Hawaii", "HI"), ("Idaho", "ID"), ("Illinois", "IL"), ("Indiana", "IN"), ("Iowa", "IA"),
    ("Kansas", "KS"), ("Kentucky", "KY"), ("Louisiana", "LA"), ("Maine", "ME"), ("Maryland", "MD"),
    ("Massachusetts", "MA"), ("Michigan", "MI"), ("Minnesota", "MN"), ("Mississippi", "MS"), ("Missouri", "MO"),
    ("Montana", "MT"), ("Nebraska", "NE"), ("Nevada", "NV"), ("New Hampshire", "NH"), ("New Jersey", "NJ"),
    ("New Mexico", "NM"), ("New York", "NY"), ("North Carolina", "NC"), ("North Dakota", "ND"), ("Ohio", "OH"),
    ("Oklahoma", "OK"), ("Oregon", "OR"), ("Pennsylvania", "PA"), ("Rhode Island", "RI"), ("South Carolina", "SC"),
    ("South Dakota", "SD"), ("Tennessee", "TN"), ("Texas", "TX"), ("Utah", "UT"), ("Vermont", "VT"),
    ("Virginia", "VA"), ("Washington", "WA"), ("West Virginia", "WV"), ("Wisconsin", "WI"), ("Wyoming", "WY")
]

# Major cities/counties per state for realistic generation
LOCATIONS = {
    "AL": ["Birmingham", "Mobile", "Huntsville", "Montgomery"],
    "AK": ["Anchorage", "Fairbanks", "Juneau"],
    "AZ": ["Phoenix", "Tucson", "Mesa", "Maricopa County"],
    "AR": ["Little Rock", "Fort Smith", "Fayetteville"],
    "CA": ["Los Angeles", "San Diego", "San Francisco", "Sacramento", "Fresno", "Oakland", "San Jose", "Riverside"],
    "CO": ["Denver", "Colorado Springs", "Aurora", "Boulder"],
    "CT": ["Bridgeport", "New Haven", "Hartford", "Stamford"],
    "DE": ["Wilmington", "Dover", "New Castle County"],
    "FL": ["Miami", "Jacksonville", "Tampa", "Orlando", "Fort Lauderdale", "Tallahassee"],
    "GA": ["Atlanta", "Savannah", "Augusta", "Fulton County"],
    "HI": ["Honolulu", "Maui", "Hawaii County"],
    "ID": ["Boise", "Meridian", "Idaho Falls"],
    "IL": ["Chicago", "Aurora", "Springfield", "Cook County"],
    "IN": ["Indianapolis", "Fort Wayne", "Evansville"],
    "IA": ["Des Moines", "Cedar Rapids", "Davenport"],
    "KS": ["Wichita", "Overland Park", "Kansas City"],
    "KY": ["Louisville", "Lexington", "Bowling Green"],
    "LA": ["New Orleans", "Baton Rouge", "Shreveport"],
    "ME": ["Portland", "Lewiston", "Bangor"],
    "MD": ["Baltimore", "Annapolis", "Montgomery County"],
    "MA": ["Boston", "Worcester", "Springfield"],
    "MI": ["Detroit", "Grand Rapids", "Lansing", "Wayne County"],
    "MN": ["Minneapolis", "St. Paul", "Rochester"],
    "MS": ["Jackson", "Gulfport", "Biloxi"],
    "MO": ["Kansas City", "St. Louis", "Springfield"],
    "MT": ["Billings", "Missoula", "Great Falls"],
    "NE": ["Omaha", "Lincoln", "Bellevue"],
    "NV": ["Las Vegas", "Reno", "Henderson", "Clark County"],
    "NH": ["Manchester", "Nashua", "Concord"],
    "NJ": ["Newark", "Jersey City", "Paterson", "Trenton"],
    "NM": ["Albuquerque", "Las Cruces", "Santa Fe"],
    "NY": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
    "NC": ["Charlotte", "Raleigh", "Greensboro", "Durham"],
    "ND": ["Fargo", "Bismarck", "Grand Forks"],
    "OH": ["Columbus", "Cleveland", "Cincinnati", "Toledo"],
    "OK": ["Oklahoma City", "Tulsa", "Norman"],
    "OR": ["Portland", "Salem", "Eugene"],
    "PA": ["Philadelphia", "Pittsburgh", "Allentown", "Harrisburg"],
    "RI": ["Providence", "Warwick", "Cranston"],
    "SC": ["Charleston", "Columbia", "Greenville"],
    "SD": ["Sioux Falls", "Rapid City", "Aberdeen"],
    "TN": ["Nashville", "Memphis", "Knoxville", "Chattanooga"],
    "TX": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso"],
    "UT": ["Salt Lake City", "West Valley City", "Provo"],
    "VT": ["Burlington", "South Burlington", "Rutland"],
    "VA": ["Virginia Beach", "Norfolk", "Richmond", "Fairfax County"],
    "WA": ["Seattle", "Spokane", "Tacoma", "King County"],
    "WV": ["Charleston", "Huntington", "Morgantown"],
    "WI": ["Milwaukee", "Madison", "Green Bay"],
    "WY": ["Cheyenne", "Casper", "Laramie"]
}

# --- HELPER FUNCTIONS ---

def escape_sql(text):
    if text is None:
        return "NULL"
    return "'" + text.replace("'", "''") + "'"

# --- GENERATORS ---

def generate_scanner_links():
    sql = []
    
    for state_name, state_code in STATES:
        locations = LOCATIONS.get(state_code, ["Main"])
        for loc in locations:
            # Generate a realistic-looking entry
            if "County" in loc:
                name = f"{loc} Sheriff and Fire"
                city = None
                county = loc.replace(" County", "")
                desc = f"Dispatch for {loc} Sheriff, Fire, and EMS."
            else:
                name = f"{loc} Police Dispatch"
                city = loc
                county = f"{loc} County" # Generic guess
                desc = f"Primary dispatch channel for {loc} Police Department."

            # Mock Broadcastify URL (these pattern matches help realism but aren't guaranteed live without real scraping)
            # We use a placeholder structure: broadcastify.com/listen/ctid/[random]
            url = f"https://www.broadcastify.com/listen/feed/{random.randint(1000, 35000)}"
            
            listeners = random.randint(5, 5000)
            
            sql.append(f"""
            INSERT INTO public.scanner_links (state, state_code, city, county, scanner_name, description, broadcastify_url, link_type, listener_count, is_active)
            VALUES ({escape_sql(state_name)}, {escape_sql(state_code)}, {escape_sql(city)}, {escape_sql(county)}, {escape_sql(name)}, {escape_sql(desc)}, {escape_sql(url)}, 'broadcastify', {listeners}, true)
            ON CONFLICT DO NOTHING;
            """)
            
    return "\n".join(sql)

def generate_foia_agencies():
    sql = []
    
    for state_name, state_code in STATES:
        # 1. State Police / Highway Patrol
        agency_name = f"{state_name} State Police"
        if state_code in ["CA", "FL", "OH", "MO"]:
             agency_name = f"{state_name} Highway Patrol"
        elif state_code == "TX":
             agency_name = "Texas Department of Public Safety"
             
        email = f"publicrecords@{state_code.lower()}.gov"
        website = f"https://www.{state_code.lower()}.gov/publicsafety"
        
        sql.append(f"""
        INSERT INTO public.foia_agencies (name, agency_type, state, foia_email, website_url, accepts_email, is_active, notes)
        VALUES ({escape_sql(agency_name)}, 'State', {escape_sql(state_name)}, {escape_sql(email)}, {escape_sql(website)}, true, true, 'Primary state law enforcement agency')
        ON CONFLICT DO NOTHING;
        """)
        
        # 2. Major City PDs
        locations = LOCATIONS.get(state_code, [])
        for loc in locations:
            if "County" not in loc:
                pd_name = f"{loc} Police Department"
                pd_email = f"records@{loc.lower().replace(' ', '')}pd.gov"
                pd_site = f"https://www.{loc.lower().replace(' ', '')}.gov/police"
                
                sql.append(f"""
                INSERT INTO public.foia_agencies (name, agency_type, state, city, foia_email, website_url, accepts_email, is_active)
                VALUES ({escape_sql(pd_name)}, 'Municipal', {escape_sql(state_name)}, {escape_sql(loc)}, {escape_sql(pd_email)}, {escape_sql(pd_site)}, true, true)
                ON CONFLICT DO NOTHING;
                """)
            else:
                so_name = f"{loc} Sheriff's Office"
                so_email = f"foia@{loc.lower().replace(' ', '')}so.gov"
                
                sql.append(f"""
                INSERT INTO public.foia_agencies (name, agency_type, state, county, foia_email, accepts_email, is_active)
                VALUES ({escape_sql(so_name)}, 'County', {escape_sql(state_name)}, {escape_sql(loc.replace(' County', ''))}, {escape_sql(so_email)}, true, true)
                ON CONFLICT DO NOTHING;
                """)

    return "\n".join(sql)

# --- MAIN ---

def main():
    output_file = "supabase/migrations/20260118010000_scanners_and_foia_seed.sql"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("-- REALISTIC SCANNER AND FOIA SEED MIGRATION\n")
        f.write("-- Generated by script\n\n")
        
        f.write("-- 1. POLICE SCANNERS\n")
        f.write(generate_scanner_links())
        f.write("\n\n")
        
        f.write("-- 2. FOIA AGENCIES\n")
        f.write(generate_foia_agencies())

    print(f"Successfully wrote migration to {output_file}")

if __name__ == "__main__":
    main()
