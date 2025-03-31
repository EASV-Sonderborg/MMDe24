let gobbleGums = [
    {name: 'Aftertaste', image: "images/Aftertaste_GobbleGum_BO3.webp"},
    {name: 'Burned Out', image: "images/Burned_Out_GobbleGum_BO3.webp"},
    {name: 'Dead of Nuclear Winter', image: "images/Dead_of_Nuclear_Winter_GobbleGum_BO3.webp"},
    {name: 'Ephemeral Enhancement', image: "images/Ephemeral_Enhancement_GobbleGum_BO3.webp"},
    {name: "I'm Feeling Lucky", image: "images/I%27m_Feeling_Lucky_GobbleGum_BO3.webp"},
    {name: 'Immolation Liquidation', image: "images/Immolation_Liquidation_GobbleGum_BO3.webp"},
    {name: 'Licensed Contractor', image: "images/Licensed_Contractor_GobbleGum_BO3.webp"},
    {name: 'Phoenix Up', image: "images/Phoenix_Up_GobbleGum_BO3.webp"},
    {name: 'Pop Shocks', image: "images/Pop_Shocks_GobbleGum_BO3.webp"},
    {name: 'Respin Cycle', image: "images/Respin_Cycle_GobbleGum_BO3.webp"},
    {name: 'Unquenchable', image: "images/Unquenchable_GobbleGum_BO3.webp"},
    {name: "Who's Keeping Score?", image: "images/Who%27s_Keeping_Score%3F_GobbleGum_BO3.webp"},
    {name: 'Crawl Space', image: "images/Crawl_Space_GobbleGum_BO3.webp"},
    {name: 'Fatal Contraption', image: "images/Fatal_Contraption_GobbleGum_BO3.webp"},
    {name: 'Unbearable', image: "images/Unbearable_GobbleGum_BO3.webp"},
    {name: 'Disorderly Combat', image: "images/Disorderly_Combat_GobbleGum_BO3.webp"},
    {name: 'Slaughter Slide', image: "images/Slaughter_Slide_GobbleGum_BO3.webp"},
    {name: 'Mind Blown', image: "images/Mind_Blown_GobbleGum_BO3.webp"},
    {name: 'Board Games', image: "images/Board_Games_GobbleGum_BO3.webp"},
    {name: 'Board To Death', image: "images/Board_To_Death.webp"},
    {name: 'Flavor Hexed', image: "images/Flavor_Hexed_GobbleGum_BO3.webp"},
    {name: 'Idle Eyes', image: "images/Idle_Eyes_GobbleGum_BO3.webp"},
    {name: 'Cache Back', image: "images/Cache_Back_GobbleGum_BO3.webp"},
    {name: 'Kill Joy', image: "images/Kill_Joy_GobbleGum_BO3.webp"},
    {name: 'On the House', image: "images/On_the_House_GobbleGum_BO3.webp"},
    {name: 'Wall Power', image: "images/Wall_Power_GobbleGum_BO3.webp"},
    {name: 'Undead Man Walking', image: "images/Undead_Man_Walking_GobbleGum_BO3.webp"},
    {name: 'Fear in Headlights', image: "images/Fear_in_Headlights_GobbleGum_BO3.webp"},
    {name: 'Temporal Gift', image: "images/Temporal_Gift_GobbleGum_BO3.webp"},
    {name: 'Crate Power', image: "images/Crate_Power_GobbleGum_BO3.webp"},
    {name: 'Bullet Boost', image: "images/Bullet_Boost_GobbleGum_BO3.webp"},
    {name: 'Extra Credit', image: "images/Extra_Credit.webp"},
    {name: 'Soda Fountain', image: "images/Soda_Fountain.webp"},
    {name: 'Killing Time', image: "images/Killing_Time_GobbleGum_BO3.webp"},
    {name: 'Perkaholic', image: "images/Perkaholic_GobbleGum_BO3.webp"},
    {name: 'Head Drama', image: "images/Head_Drama_GobbleGum_BO3.webp"},
    {name: 'Secret Shopper', image: "images/Secret_Shopper_GobbleGum_BO3.webp"},
    {name: 'Shopping Free', image: "images/Shopping_Free_GobbleGum_BO3.webp"},
    {name: 'Near Death Experience', image: "images/Near_Death_Experience_GobbleGum_BO3.webp"},
    {name: 'Profit Sharing', image: "images/Profit_Sharing_GobbleGum_BO3.webp"},
    {name: 'Round Robbin', image: "images/Round_Robbin%27_GobbleGum_BO3.webp"},
    {name: 'Self Medication', image: "images/Self_Medication_GobbleGum_BO3.webp"},
    {name: 'Power Vacuum', image: "images/Power_Vacuum_GobbleGum_BO3.webp"},
    {name: 'Reign Drops', image: "images/Reign_Drops_GobbleGum_BO3.webp"}
] 

let dailyCycle = [
    {

    }
]

console.log(gobbleGums);



























// Calculate current day in cycle

function getCurrentCycleDay(startDate) {
    const cycleLength = 36;
    const start = new Date(startDate);
    const today = new Date();
    
    const diffInTime = today - start;
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
    
    return (diffInDays % cycleLength) + 1; // Cycle day starts at 1
}

// Example usage (assuming cycle started on a known date)
const cycleStartDate = "2017-07-10"; // Adjust this to match the real cycle start
console.log("Current Cycle Day:", getCurrentCycleDay(cycleStartDate));
