// Mock data for technicians + customers
const TECHS = [
  {
    id: "tech-7", initials: "JT", name: "Jamal Thompson", handle: "JW TechSeven",
    color: "#0EA5BF", email: "jwtech7@yopmail.com", phone: "+1 (404) 555-0719",
    type: "Certified", status: "Active", bgCheck: "Confirmed", rating: 4.8, reviews: 47,
    onboarding: 100, tier: "Tier 3", payRate: 30, monthlyJobs: 12, lifetimeJobs: 217,
    grossYTD: 14860, joined: "2024-09-12", lastActive: "Today, 11:42 AM",
    serviceZips: ["30319","30338","30342","30341"], baseZip: "30319",
    state: "GA", city: "Brookhaven",
    address: "2497 Tanbark Ct NE, Brookhaven, GA 30319",
    weeklyAvail: 58,
    schedule: { Mon:["08:00","17:00"], Tue:["08:00","17:00"], Wed:["08:00","17:00"], Thu:["08:00","17:00"], Fri:["08:00","17:00"], Sat:["10:00","15:00"], Sun:["off","off"] },
    bio: "Certified detailer, 6 yrs experience. Specializes in interior shampoo + ceramic prep. Speaks English & Spanish.",
    skills:["Ceramic prep","Interior shampoo","Pet hair","Engine bay"],
    vehicles:[{id:"v1",label:"2019 Ford Transit",plate:"GA · KLM-4421",photo:"transit"}],
    docs:[{name:"Driver's License",status:"verified",exp:"2028-04-11"},{name:"Insurance · Liability",status:"verified",exp:"2026-12-01"},{name:"COI · Auto",status:"verified",exp:"2026-08-30"},{name:"W-9",status:"verified"},{name:"Background Check",status:"verified",exp:"2027-02-12"}],
    flags:[],
    upcoming:[
      {id:"b-2031",when:"Today · 1:30 PM",customer:"Christi Vanfossan",vehicle:"2022 Tesla Model Y",addr:"3110 Roswell Rd, Atlanta",svc:"Sedan/SUV Premium",pay:135,status:"En route"},
      {id:"b-2034",when:"Today · 4:00 PM",customer:"Marcus Lee",vehicle:"2020 Honda Pilot",addr:"825 Lenox Park Blvd",svc:"Large SUV Quarterly",pay:165,status:"Scheduled"},
      {id:"b-2041",when:"Tue · 10:00 AM",customer:"Aisha Osei",vehicle:"2023 BMW X5",addr:"1444 Peachtree NE",svc:"Ceramic Boost",pay:220,status:"Scheduled"},
    ],
    history:[
      {id:"b-1998",when:"Yesterday · 3:15 PM",customer:"Devon Park",svc:"Sedan Bi-Monthly",rating:5,pay:115,note:"Tipped $20"},
      {id:"b-1991",when:"May 1 · 11:00 AM",customer:"Riya Kapoor",svc:"Large SUV Quarterly",rating:5,pay:165},
      {id:"b-1976",when:"Apr 29 · 9:30 AM",customer:"Tom Brennan",svc:"Sedan Premium",rating:4,pay:135,note:"Customer asked about ceramic add-on"},
    ],
    reviewItems:[
      {by:"Devon P.",rating:5,when:"Yesterday",text:"Jamal was on time, friendly and the car looked showroom-new. Will book again."},
      {by:"Riya K.",rating:5,when:"3 days ago",text:"Excellent attention to detail on the wheels and trim."},
      {by:"Tom B.",rating:4,when:"5 days ago",text:"Solid wash. Was a few minutes late but communicated."},
    ],
    activity:[
      {when:"Today, 11:42 AM",text:"Marked en route for booking #b-2031"},
      {when:"Today, 8:02 AM",text:"Started shift · checked-in at 30319"},
      {when:"Yesterday",text:"Completed 3 bookings · earned $415"},
      {when:"2 days ago",text:"Background check re-confirmed (annual)"},
      {when:"4 days ago",text:"Updated availability for next week"},
    ],
    payouts:[
      {period:"Apr 28 – May 4",gross:1240,fees:124,net:1116,status:"Pending"},
      {period:"Apr 21 – Apr 27",gross:1485,fees:148,net:1337,status:"Paid"},
      {period:"Apr 14 – Apr 20",gross:1210,fees:121,net:1089,status:"Paid"},
    ],
  },
  // a couple lighter rows for the roster
  {id:"tech-9",initials:"JT",name:"Janelle Tran",handle:"JW TechNine",color:"#1F66E5",type:"Independent",status:"Active",bgCheck:"Confirmed",rating:4.6,reviews:18,onboarding:100,tier:"Tier 1",payRate:20,monthlyJobs:4,lifetimeJobs:24,joined:"2025-12-02",lastActive:"22 min ago",serviceZips:["30030","30307"],email:"jwtech9@yopmail.com",phone:"+1 (404) 555-0193",baseZip:"30030"},
  {id:"tech-8",initials:"JE",name:"Jordan Ellis",handle:"JW TechEight",color:"#F59E0B",type:"Independent",status:"Pending",bgCheck:"Incomplete",rating:null,reviews:0,onboarding:35,tier:"Standard",payRate:0,monthlyJobs:0,lifetimeJobs:0,joined:"2026-04-30",lastActive:"3 days ago",serviceZips:["30084"],email:"jwtech8@yopmail.com",phone:"+1 (404) 555-0188",baseZip:"30084"},
  {id:"tech-6",initials:"JS",name:"Jamie Soto",handle:"JW TechSix",color:"#1F66E5",type:"Independent",status:"Pending",bgCheck:"Incomplete",rating:null,reviews:0,onboarding:0,tier:"Standard",payRate:0,monthlyJobs:0,lifetimeJobs:0,joined:"2026-05-01",lastActive:"never",serviceZips:[],email:"jwtech6@yopmail.com",phone:"—",baseZip:"—"},
  {id:"tech-5",initials:"SS",name:"Shubham Sharma",handle:"shubham sharma",color:"#1F66E5",type:"Independent",status:"Inactive",bgCheck:"Incomplete",rating:null,reviews:0,onboarding:0,tier:"Standard",payRate:0,monthlyJobs:0,lifetimeJobs:0,joined:"2026-04-30",lastActive:"4 days ago",serviceZips:["94123"],email:"sl111@yopmail.com",phone:"—",baseZip:"94123"},
  {id:"tech-4",initials:"NT",name:"Nico Tate",handle:"New Test",color:"#0EA5BF",type:"Independent",status:"Active",bgCheck:"Incomplete",rating:null,reviews:0,onboarding:0,tier:"Standard",payRate:0,monthlyJobs:0,lifetimeJobs:0,joined:"2026-04-29",lastActive:"yesterday",serviceZips:["12111"],email:"newtest@yopmail.com",phone:"—",baseZip:"12111"},
  {id:"tech-3",initials:"TN",name:"Tasha N.",handle:"test new",color:"#15A66B",type:"Certified",status:"Active",bgCheck:"Confirmed",rating:5.0,reviews:6,onboarding:100,tier:"Standard",payRate:0,monthlyJobs:0,lifetimeJobs:0,joined:"2026-04-29",lastActive:"5 hr ago",serviceZips:["12121"],email:"tn@yopmail.com",phone:"—",baseZip:"12121"},
];

const CUSTOMERS = [
  {
    id:"cust-7", initials:"JC", name:"Christi Vanfossan", handle:"jwcustseven",
    color:"#6E46D6", email:"christivanfossan@gmail.com", phone:"+1 (404) 555-0921",
    status:"Active", customerSince:"2025-08-14", lifetime:1245.00, credits:2, plan:"Large SUV Quarterly + Sedan/SUV Quarterly",
    cadence:"Every 3 months", nextRenewal:"2026-07-12", upcomingBooking:"Today, 1:30 PM",
    addr:"3110 Roswell Rd NE, Atlanta GA 30305",
    city:"Atlanta", state:"GA", zip:"30305",
    bookings:18, completed:17, cancelled:1, lateCancel:0, disputes:0,
    vehicles:[
      {id:"vh1",make:"Tesla",model:"Model Y",year:2022,color:"Pearl White",size:"Large SUV",plate:"GA · TES-201",ceramic:true,plan:"Large SUV Quarterly",photo:"tesla"},
      {id:"vh2",make:"Honda",model:"Accord",year:2019,color:"Modern Steel",size:"Sedan",plate:"GA · ACC-998",ceramic:false,plan:"Sedan/SUV Quarterly",photo:"accord"},
    ],
    paymentMethods:[
      {brand:"Visa",last4:"4242",exp:"08/27",default:true},
      {brand:"Mastercard",last4:"7621",exp:"03/26",default:false},
    ],
    upcomingBookings:[
      {id:"b-2031",when:"Today · 1:30 PM",vehicle:"2022 Tesla Model Y",tech:"Jamal Thompson",svc:"Sedan/SUV Premium",total:135,status:"En route"},
      {id:"b-2055",when:"May 22 · 9:00 AM",vehicle:"2019 Honda Accord",tech:"Auto-assign",svc:"Sedan Quarterly",total:115,status:"Scheduled"},
    ],
    pastBookings:[
      {id:"b-1944",when:"Apr 14",vehicle:"2022 Tesla Model Y",tech:"Jamal Thompson",svc:"Large SUV Quarterly",total:165,rating:5},
      {id:"b-1899",when:"Mar 29",vehicle:"2019 Honda Accord",tech:"Tasha N.",svc:"Sedan Bi-Monthly",total:115,rating:5},
      {id:"b-1851",when:"Mar 14",vehicle:"2022 Tesla Model Y",tech:"Jamal Thompson",svc:"Ceramic Boost",total:220,rating:5},
      {id:"b-1814",when:"Feb 28",vehicle:"2019 Honda Accord",tech:"Janelle Tran",svc:"Sedan Quarterly",total:115,rating:4},
    ],
    invoices:[
      {id:"INV-2031",date:"May 3",amount:135,status:"Pending"},
      {id:"INV-1944",date:"Apr 14",amount:165,status:"Paid"},
      {id:"INV-1899",date:"Mar 29",amount:115,status:"Paid"},
      {id:"INV-1851",date:"Mar 14",amount:220,status:"Paid"},
    ],
    creditLog:[
      {when:"Apr 14",delta:1,note:"Quarterly plan credit"},
      {when:"Mar 29",delta:-1,note:"Redeemed · Sedan Bi-Monthly"},
      {when:"Mar 14",delta:1,note:"Loyalty bonus"},
    ],
    notes:[
      {by:"Casey (CS)",when:"Apr 16",text:"Customer prefers afternoon slots, gate code 4421."},
      {by:"Riley (CS)",when:"Mar 30",text:"Has two dogs — leave gate closed after wash."},
    ],
    disputesLog:[],
    activity:[
      {when:"Today, 9:14 AM",text:"Confirmed booking #b-2031"},
      {when:"Yesterday",text:"Updated default payment method"},
      {when:"3 days ago",text:"Used 1 credit · redeemed Sedan Bi-Monthly"},
    ],
  },
  {id:"cust-10",initials:"JC",name:"JW CustTen",handle:"jwcust10@yopmail.com",color:"#1F66E5",status:"Active",customerSince:"2026-05-03",lifetime:0,credits:0,plan:"No Plan",cadence:"—",nextRenewal:"—",bookings:0,upcomingBooking:"—",city:"Brookhaven",state:"GA",zip:"N/A",email:"jwcust10@yopmail.com",phone:"+1 4654...464"},
  {id:"cust-9",initials:"JC",name:"JW CustNine",handle:"jwcust9@yopmail.com",color:"#15A66B",status:"Active",customerSince:"2026-05-02",lifetime:330,credits:3,plan:"Large SUV Quarterly + Sedan Quarterly",cadence:"Every 3 months",nextRenewal:"2026-08-02",bookings:3,upcomingBooking:"May 10",city:"Atlanta",state:"GA",zip:"30305",email:"jwcust9@yopmail.com",phone:"—"},
  {id:"cust-8",initials:"JC",name:"JW CustEight",handle:"jwcust8@yopmail.com",color:"#0EA5BF",status:"Active",customerSince:"2026-05-02",lifetime:230,credits:0,plan:"Bi-Monthly Large SUV + Bi-Monthly Sedan",cadence:"Every 2 months",nextRenewal:"2026-07-02",bookings:3,upcomingBooking:"May 14",city:"Decatur",state:"GA",zip:"30030",email:"jwcust8@yopmail.com",phone:"—"},
  {id:"cust-6",initials:"JC",name:"JW CustSix",handle:"jwcust6@yopmail.com",color:"#F59E0B",status:"Active",customerSince:"2026-05-01",lifetime:115,credits:3,plan:"No Plan",cadence:"—",nextRenewal:"—",bookings:2,upcomingBooking:"—",city:"Atlanta",state:"GA",zip:"30307",email:"jwcust6@yopmail.com",phone:"—"},
  {id:"cust-3",initials:"JC",name:"JW CustThree",handle:"jwcust3@yopmail.com",color:"#6E46D6",status:"Active",customerSince:"2026-05-01",lifetime:0,credits:0,plan:"No Plan",cadence:"—",nextRenewal:"—",bookings:0,upcomingBooking:"—",city:"—",state:"—",zip:"N/A",email:"jwcust3@yopmail.com",phone:"—"},
  {id:"cust-2",initials:"JC",name:"JW CustTwo",handle:"jwcust2@yopmail.com",color:"#1F66E5",status:"Active",customerSince:"2026-05-01",lifetime:0,credits:0,plan:"No Plan",cadence:"—",nextRenewal:"—",bookings:0,upcomingBooking:"—",city:"—",state:"—",zip:"N/A",email:"jwcust2@yopmail.com",phone:"—"},
  {id:"cust-100",initials:"AB",name:"Amelia Brooks",color:"#0EA5BF",status:"Active",customerSince:"2024-03-12",lifetime:2840,credits:4,plan:"Large SUV Quarterly + Sedan/SUV Quarterly",cadence:"Every 3 months",nextRenewal:"2026-06-12",bookings:24,upcomingBooking:"May 12",city:"Atlanta",state:"GA",zip:"30305",email:"amelia.brooks@gmail.com",phone:"+1 (404) 555-0188",handle:"amelia.brooks@gmail.com"},
  {id:"cust-101",initials:"DK",name:"Derek Kim",color:"#6E46D6",status:"Active",customerSince:"2024-05-22",lifetime:1980,credits:1,plan:"Sedan/SUV Quarterly",cadence:"Every 3 months",nextRenewal:"2026-05-22",bookings:16,upcomingBooking:"May 22",city:"Decatur",state:"GA",zip:"30030",email:"derek.kim@gmail.com",phone:"+1 (404) 555-0144",handle:"derek.kim@gmail.com"},
  {id:"cust-102",initials:"PR",name:"Priya Reddy",color:"#15A66B",status:"Active",customerSince:"2024-07-08",lifetime:3450,credits:6,plan:"Bi-Monthly Large SUV + Bi-Monthly Sedan",cadence:"Every 2 months",nextRenewal:"2026-05-15",bookings:31,upcomingBooking:"May 15",city:"Brookhaven",state:"GA",zip:"30319",email:"priya.reddy@gmail.com",phone:"+1 (404) 555-0211",handle:"priya.reddy@gmail.com"},
  {id:"cust-103",initials:"MO",name:"Marcus Owens",color:"#F59E0B",status:"Suspended",customerSince:"2024-11-30",lifetime:540,credits:0,plan:"Sedan/SUV Quarterly",cadence:"Every 3 months",nextRenewal:"—",bookings:5,upcomingBooking:"—",city:"Sandy Springs",state:"GA",zip:"30342",email:"marcus.owens@gmail.com",phone:"+1 (404) 555-0177",handle:"marcus.owens@gmail.com"},
  {id:"cust-104",initials:"LT",name:"Lena Torres",color:"#1F66E5",status:"Active",customerSince:"2025-02-14",lifetime:1120,credits:2,plan:"Large SUV Quarterly",cadence:"Every 3 months",nextRenewal:"2026-08-14",bookings:9,upcomingBooking:"May 28",city:"Atlanta",state:"GA",zip:"30307",email:"lena.torres@gmail.com",phone:"+1 (404) 555-0223",handle:"lena.torres@gmail.com"},
  {id:"cust-105",initials:"JM",name:"Jordan Morales",color:"#0EA5BF",status:"Active",customerSince:"2025-04-04",lifetime:780,credits:0,plan:"Bi-Monthly Sedan",cadence:"Every 2 months",nextRenewal:"2026-06-04",bookings:7,upcomingBooking:"Jun 04",city:"Atlanta",state:"GA",zip:"30305",email:"jordan.morales@gmail.com",phone:"+1 (404) 555-0399",handle:"jordan.morales@gmail.com"},
  {id:"cust-106",initials:"SH",name:"Sara Harper",color:"#6E46D6",status:"Active",customerSince:"2025-09-19",lifetime:445,credits:1,plan:"Sedan/SUV Quarterly",cadence:"Every 3 months",nextRenewal:"2026-09-19",bookings:4,upcomingBooking:"Sep 19",city:"Decatur",state:"GA",zip:"30030",email:"sara.harper@gmail.com",phone:"+1 (404) 555-0481",handle:"sara.harper@gmail.com"},
  {id:"cust-107",initials:"RC",name:"Ryan Chen",color:"#F59E0B",status:"Active",customerSince:"2025-11-02",lifetime:330,credits:3,plan:"Large SUV Quarterly",cadence:"Every 3 months",nextRenewal:"2026-08-02",bookings:3,upcomingBooking:"Aug 02",city:"Brookhaven",state:"GA",zip:"30319",email:"ryan.chen@gmail.com",phone:"+1 (404) 555-0512",handle:"ryan.chen@gmail.com"},
  {id:"cust-108",initials:"NV",name:"Nina Volkov",color:"#15A66B",status:"Active",customerSince:"2025-12-15",lifetime:230,credits:0,plan:"No Plan",cadence:"—",nextRenewal:"—",bookings:2,upcomingBooking:"—",city:"Sandy Springs",state:"GA",zip:"30342",email:"nina.volkov@gmail.com",phone:"—",handle:"nina.volkov@gmail.com"},
  {id:"cust-109",initials:"BD",name:"Brian Daly",color:"#1F66E5",status:"Suspended",customerSince:"2024-08-21",lifetime:890,credits:0,plan:"Sedan/SUV Quarterly",cadence:"Every 3 months",nextRenewal:"—",bookings:8,upcomingBooking:"—",city:"Atlanta",state:"GA",zip:"30307",email:"brian.daly@gmail.com",phone:"+1 (404) 555-0671",handle:"brian.daly@gmail.com"},
];

window.TECHS = TECHS;
window.CUSTOMERS = CUSTOMERS;
