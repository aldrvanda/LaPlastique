// ===================================
// CONFIGURATION & STATE
// ===================================

const config = {
    background_color: "#FFFFFF",
    surface_color: "#CFF0DE",
    text_color: "#218B54",
    primary_action_color: "#3CB371",
    secondary_action_color: "#218B54",
    site_title: "La Plastique",
    hero_title: "Track Your Plastic, Transform Your Impact",
};

let currentPage = 'auth';
let isLoggedIn = false;
let currentUser = null;
let plasticData = [];
let isLoading = false;
let aiRecommendation = null;
let selectedVideos = null;
let authMode = 'login';
let selectedTimeframe = 'daily';
let users = [];


const plasticCategories = [
    { id: 'bottle', name: 'Plastic Bottles', icon: '🍾' },
    { id: 'bag', name: 'Shopping Bags', icon: '🛍️' },
    { id: 'food', name: 'Food Packaging', icon: '🍱' },
    { id: 'sachet', name: 'Sachets', icon: '📦' }
];

const videoRecommendations = {
    bottle: [
        { title: "10 Ways to Reuse Plastic Bottles", url: "https://www.youtube.com/embed/edXimuzIVhk", description: "Creative ideas to repurpose plastic bottles" },
        { title: "DIY Plastic Bottle Garden", url: "https://www.youtube.com/embed/xyzpFiaHdBY", description: "Transform bottles into a vertical garden" }
    ],
    bag: [
        { title: "How to Recycle Plastic Bags", url: "https://www.youtube.com/embed/j-7grMXIXs0", description: "Learn the right way to recycle plastic bags" },
        { title: "Make Reusable Bags", url: "https://www.youtube.com/embed/BPsPoAzVv78", description: "Upcycle plastic bags into reusable shopping bags" }
    ],
    food: [
        { title: "Reduce Food Packaging Waste", url: "https://www.youtube.com/embed/ldudwTOmNmw", description: "Tips for minimizing plastic food packaging" },
        { title: "Food Container Upcycling", url: "https://www.youtube.com/embed/4T6e0LA96Ew", description: "Turn food containers into storage solutions" }
    ],
    sachet: [
        { title: "Sachet Recycling Ideas", url: "https://www.youtube.com/embed/uIFvr71I8Go", description: "Innovative ways to recycle sachets" },
        { title: "Make Eco-Bricks from Sachets", url: "https://www.youtube.com/embed/g3ZRmzgmUMw", description: "Turn sachets into eco-bricks" }
    ]
};

const aiRecommendations = {
    bottle: {
        low: {
            assessment: "Great job! Your plastic bottle usage is low.",
            tips: ["Continue using reusable water bottles", "Invest in an insulated bottle", "Keep a backup bottle in your car"],
            alternatives: ["Stainless steel bottles", "Glass water bottles", "Collapsible silicone bottles"],
            recycling: "Clean bottles can be repurposed as plant waterers or storage containers",
            impact: "You're preventing approximately 50 plastic bottles from entering landfills annually."
        },
        medium: {
            assessment: "You're using a moderate amount of plastic bottles. There's room for improvement!",
            tips: ["Set a goal to carry a reusable bottle daily", "Install a water filter at home", "Choose cafes that offer free water refills"],
            alternatives: ["Reusable bottles with time markers", "Filtered water pitchers", "Water delivery in reusable containers"],
            recycling: "Turn bottles into planters, organizers, or bird feeders",
            impact: "Reducing by 50% would save approximately 100 bottles per year."
        },
        high: {
            assessment: "Your plastic bottle consumption is high. Let's work on reducing this!",
            tips: ["Commit to a 30-day challenge: no single-use bottles", "Set phone reminders to refill", "Calculate annual cost to motivate change"],
            alternatives: ["Large capacity reusable bottles (32oz+)", "Home water filtration system", "Portable water purification devices"],
            recycling: "Collect bottles for community recycling drives",
            impact: "Switching to reusable bottles could eliminate 300+ plastic bottles annually!"
        }
    },
    bag: {
        low: {
            assessment: "Excellent! You're already minimizing plastic bag usage.",
            tips: ["Share your success with friends", "Keep reusable bags in multiple locations", "Upgrade to premium reusable bags"],
            alternatives: ["Mesh produce bags", "Foldable shopping totes", "Backpacks for larger trips"],
            recycling: "Donate extra reusable bags to community programs",
            impact: "You're preventing approximately 150 plastic bags from polluting ecosystems!"
        },
        medium: {
            assessment: "You're doing okay, but there's opportunity to reduce further.",
            tips: ["Keep foldable bags in your pocket", "Decline plastic bags for small purchases", "Check for bags before leaving home"],
            alternatives: ["Compact reusable bags", "Canvas tote bags", "String shopping bags"],
            recycling: "Reuse plastic bags as trash liners for small bins",
            impact: "Cutting usage in half could save 200+ plastic bags annually."
        },
        high: {
            assessment: "Your plastic bag usage is quite high. Let's create an action plan!",
            tips: ["Purchase 5-10 reusable bags and commit to using them", "Leave bags by your door as reminder", "Celebrate each trip without plastic"],
            alternatives: ["Heavy-duty reusable shopping bags", "Wheeled shopping carts", "Produce bags from recycled materials"],
            recycling: "Return plastic bags to store recycling bins",
            impact: "Eliminating single-use bags could prevent 500+ bags from entering landfills!"
        }
    },
    food: {
        low: {
            assessment: "Wonderful! Your food packaging waste is minimal.",
            tips: ["Continue bringing containers for takeout", "Share strategies on social media", "Support stores with minimal packaging"],
            alternatives: ["Beeswax wraps", "Silicone food storage bags", "Stainless steel lunch containers"],
            recycling: "Clean packaging can be used for organizing or craft projects",
            impact: "Your habits prevent approximately 100 pieces of packaging waste annually!"
        },
        medium: {
            assessment: "You're making progress, but there's room to reduce further.",
            tips: ["Meal prep at home to reduce takeout packaging", "Buy bulk items in reusable containers", "Choose minimal or compostable packaging"],
            alternatives: ["Glass meal prep containers", "Reusable snack bags", "Lunch boxes with compartments"],
            recycling: "Clean containers can be donated to schools for art projects",
            impact: "Reducing by half would eliminate 150+ packaging items per year."
        },
        high: {
            assessment: "Your food packaging consumption needs attention. Let's tackle this!",
            tips: ["Plan weekly meals to reduce impulse purchases", "Bring containers for restaurant leftovers", "Shop at farmers markets with your containers"],
            alternatives: ["Complete set of reusable food containers", "Cloth produce bags", "Zero-waste grocery shopping kit"],
            recycling: "Rinse and recycle #1-7 plastics where facilities accept them",
            impact: "Making the switch could prevent 400+ packaging items from polluting!"
        }
    },
    sachet: {
        low: {
            assessment: "Impressive! You're successfully avoiding single-use sachets.",
            tips: ["Continue choosing full-size products", "Advocate for sachet-free options", "Support brands with refill stations"],
            alternatives: ["Bar soaps and shampoos", "Refillable product containers", "Concentrated products"],
            recycling: "Sachets are difficult to recycle; avoidance is key",
            impact: "You're preventing approximately 200 sachets from entering waste streams!"
        },
        medium: {
            assessment: "Good effort, but sachets are still part of your routine.",
            tips: ["Switch to refillable bottles", "Buy family-size or bulk versions", "Look for sachet alternatives at eco-friendly stores"],
            alternatives: ["Solid bars (shampoo, conditioner, soap)", "Refill stations for detergents", "Bulk buying with reusable containers"],
            recycling: "Collect clean sachets for specialized recycling programs",
            impact: "Halving sachet use could eliminate 300+ sachets annually."
        },
        high: {
            assessment: "Sachets are a major part of your plastic footprint. Time for a big change!",
            tips: ["Commit to buying zero sachets for one month", "Calculate cost: bulk products are more economical", "Create a DIY home refill station"],
            alternatives: ["Concentrated products in refillable bottles", "Bar products for all personal care", "Large economy sizes with pump dispensers"],
            recycling: "Most sachets cannot be recycled; prevention is the only solution",
            impact: "Eliminating sachets could prevent 600+ items from polluting ecosystems!"
        }
    }
};

// ===================================
// LOCAL STORAGE FUNCTIONS
// ===================================

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function loadUsers() {
    const savedUsers = localStorage.getItem('users');
    users = savedUsers ? JSON.parse(savedUsers) : [];
}

function saveToLocalStorage() {
    localStorage.setItem('plasticData', JSON.stringify(plasticData));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
}

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('plasticData');
        const savedUser = localStorage.getItem('currentUser');
        const savedLogin = localStorage.getItem('isLoggedIn');
        
        if (savedData) plasticData = JSON.parse(savedData);
        if (savedUser) currentUser = JSON.parse(savedUser);
        if (savedLogin) isLoggedIn = JSON.parse(savedLogin);
    } catch (e) {
        console.error('Error loading from localStorage:', e);
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function generateAISummary() {
    if (plasticData.length === 0) {
        return {
            overview: "No data available yet. Start adding records to see your AI-powered analysis.",
            insights: []
        };
    }

    const totalItems = plasticData.length;
    const categoryCounts = plasticCategories.map(cat => ({
        ...cat,
        count: plasticData.filter(item => item.category === cat.id).length
    }));
    
    const maxCategory = categoryCounts.reduce((max, cat) => cat.count > max.count ? cat : max, categoryCounts[0]);
    
    const today = new Date();
    const thisWeek = plasticData.filter(item => {
        const itemDate = new Date(item.date);
        const diffDays = Math.ceil(Math.abs(today - itemDate) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    }).length;
    
    const daysTracked = new Set(plasticData.map(item => item.date)).size;
    const avgPerDay = (totalItems / Math.max(1, daysTracked)).toFixed(1);

    const insights = [];
    
    if (maxCategory.count > 0) {
        insights.push({
            icon: '📊',
            text: `Your primary plastic consumption is ${maxCategory.name} with ${maxCategory.count} items (${(maxCategory.count / totalItems * 100).toFixed(0)}% of total).`
        });
    }
    
    insights.push({
        icon: '📅',
        text: `This week you've used ${thisWeek} plastic items. You're averaging ${avgPerDay} items per day.`
    });
    
    if (avgPerDay < 3) {
        insights.push({ icon: '🌟', text: `Excellent work! Your daily average is low. Keep maintaining these sustainable habits.` });
    } else if (avgPerDay > 5) {
        insights.push({ icon: '💡', text: `There's room for improvement. Try reducing your usage by starting with alternatives for ${maxCategory.name}.` });
    } else {
        insights.push({ icon: '✅', text: `You're doing well! Small reductions in ${maxCategory.name} usage could make a big environmental difference.` });
    }

    return { overview: `Based on your ${totalItems} tracked items over ${daysTracked} days, our AI analysis shows you're averaging ${avgPerDay} plastic items daily. ${maxCategory.name} represents your largest usage category.`, insights };
}

function getUsageChartData(timeframe) {
    if (plasticData.length === 0) return [];
    const today = new Date();
    
    if (timeframe === 'daily') {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = plasticData.filter(item => item.date === dateStr).length;
            last7Days.push({ label: date.toLocaleDateString('en-US', { weekday: 'short' }), value: count });
        }
        return last7Days;
    } else if (timeframe === 'monthly') {
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const count = plasticData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getMonth() === date.getMonth() && itemDate.getFullYear() === date.getFullYear();
            }).length;
            last6Months.push({ label: date.toLocaleDateString('en-US', { month: 'short' }), value: count });
        }
        return last6Months;
    } else {
        const years = [...new Set(plasticData.map(item => new Date(item.date).getFullYear()))].sort();
        return years.map(year => ({
            label: year.toString(),
            value: plasticData.filter(item => new Date(item.date).getFullYear() === year).length
        }));
    }
}

function generateInsights() {
    if (plasticData.length === 0) return [];
    const insights = [];
    const categoryCounts = plasticCategories.map(cat => ({
        ...cat, count: plasticData.filter(item => item.category === cat.id).length
    }));
    const maxCategory = categoryCounts.reduce((max, cat) => cat.count > max.count ? cat : max, categoryCounts[0]);
    
    if (maxCategory.count > 0) {
        insights.push({ icon: maxCategory.icon, text: `${maxCategory.name} is your most used plastic type with ${maxCategory.count} items (${(maxCategory.count / plasticData.length * 100).toFixed(1)}% of total).` });
    }
    
    const avgPerDay = (plasticData.length / Math.max(1, new Set(plasticData.map(item => item.date)).size)).toFixed(1);
    insights.push({ icon: '📊', text: `On average, you use ${avgPerDay} plastic items per day.` });
    
    const daysTracked = new Set(plasticData.map(item => item.date)).size;
    if (daysTracked >= 7) {
        insights.push({ icon: '🏆', text: `You've been tracking for ${daysTracked} days! Consistency is key.` });
    }
    return insights;
}

function generateSummary() {
    if (plasticData.length === 0) return "No data yet. Start tracking!";
    const totalItems = plasticData.length;
    const daysTracked = new Set(plasticData.map(item => item.date)).size;
    const avgPerDay = (totalItems / Math.max(1, daysTracked)).toFixed(1);
    const categoryCounts = plasticCategories.map(cat => ({ ...cat, count: plasticData.filter(item => item.category === cat.id).length }));
    const maxCategory = categoryCounts.reduce((max, cat) => cat.count > max.count ? cat : max, categoryCounts[0]);
    return `You have tracked ${totalItems} plastic items over ${daysTracked} days, averaging ${avgPerDay} items per day. Your primary consumption is ${maxCategory.name} (${maxCategory.count} items). Keep up the great work!`;
}

function generateTrendAnalysis() {
    if (plasticData.length === 0) return [];
    const trends = [];
    const today = new Date();
    const thisWeek = plasticData.filter(item => { const d = new Date(item.date); return Math.ceil(Math.abs(today - d) / (1000*60*60*24)) <= 7; }).length;
    const lastWeek = plasticData.filter(item => { const d = new Date(item.date); const diff = Math.ceil(Math.abs(today - d) / (1000*60*60*24)); return diff > 7 && diff <= 14; }).length;
    
    if (lastWeek > 0) {
        const trend = thisWeek < lastWeek ? 'down' : thisWeek > lastWeek ? 'up' : 'stable';
        trends.push({ label: 'Weekly Trend', trend, description: trend === 'down' ? `Usage decreased! ${thisWeek} vs ${lastWeek} last week.` : trend === 'up' ? `Usage increased. ${thisWeek} vs ${lastWeek} last week.` : `Stable at ${thisWeek} items/week.` });
    }
    
    const daysTracked = new Set(plasticData.map(item => item.date)).size;
    const avgPerDay = (plasticData.length / Math.max(1, daysTracked)).toFixed(1);
    trends.push({ label: 'Daily Average', trend: avgPerDay < 3 ? 'down' : avgPerDay > 5 ? 'up' : 'stable', description: `You average ${avgPerDay} items per day.` });
    return trends;
}

// ===================================
// RENDER NAVIGATION
// ===================================

function renderNavigation() {
  return `
    <nav class="lp-nav" style="background-color:${config.surface_color}; position:sticky; top:0; z-index:1000;">
      <div class="lp-nav-inner" style="max-width:1200px; margin:0 auto;">
        <div class="lp-nav-row">
          <div class="lp-nav-brand">
            <img src="LOGO nav.png" class="lp-nav-logo" alt="La Plastique Logo">
          </div>

          <div class="lp-nav-links font-body">
            <a href="#" onclick="navigateTo('home'); return false;" class="nav-link">Home</a>
            <a href="#" onclick="navigateTo('tracker'); return false;" class="nav-link">Tracker</a>
            <a href="#" onclick="navigateTo('recommendation'); return false;" class="nav-link">Recommendations</a>
            <a href="#" onclick="navigateTo('statistics'); return false;" class="nav-link">Statistics</a>
            <a href="#" onclick="navigateTo('profile'); return false;" class="nav-link">Profile</a>
            <a href="#" onclick="navigateTo('about'); return false;" class="nav-link">About</a>
          </div>
        </div>
      </div>
    </nav>
  `;
}


// ===================================
// RENDER FOOTER
// ===================================

function renderFooter() {
    return `
        <footer style="background-color: #CFF0DE; margin: 0; padding: 40px 0;">
            <div style="max-width: 1200px; margin: 0 auto; padding: 0 32px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; margin-bottom: 30px;">
                    <!-- Logo & Contact -->
                    <div class="fade-in">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <img src="logo la plastique.png" alt="Recycling bin with plastic" style="max-width: 80%; height: auto; border-radius: 12px; rgba(0,0,0,0.2);">
                        </div>
                        <p class="font-body" style="font-family: 'Poppins', sans-serif; color: #0e4929ff; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
                            Every small action matters. Start your sustainability journey today with La Plastique.
                        </p>
                        <div class="font-body" style="font-family: 'Poppins', sans-serif; color: #0e4929ff; font-size: 13px;">
                            <p style="margin: 0 0 8px 0; font-weight: 600;">Our Contacts:</p>
                            <p style="margin: 0 0 4px 0;">📍 Address: Jl. Raya Kb. Jeruk No.27, RT.1/RW.9, Kemanggisan, Kec. Palmerah, Kota Jakarta Barat</p>
                            <p style="margin: 0;">✉️ Email: contact@la_plastique.id</p>
                        </div>
                    </div>
                    
                    <!-- Navigation -->
                    <div class="fade-in">
                        <h4 class="font-headline" style="font-family: 'Poppins', sans-serif; color: #0e4929ff; font-size: 18px; margin-bottom: 16px;">Navigation</h4>
                        <div style="font-family: 'Poppins', sans-serif; display: flex; flex-direction: column; gap: 8px;">
                            <a href="#" onclick="navigateTo('home'); return false;" class="footer-link" style="color: #0e4929ff; text-decoration: none; font-size: 14px; transition: all 0.3s ease;">Home</a>
                            <a href="#" onclick="navigateTo('tracker'); return false;" class="footer-link" style="color: #0e4929ff; text-decoration: none; font-size: 14px; transition: all 0.3s ease;">Tracker</a>
                            <a href="#" onclick="navigateTo('recommendation'); return false;" class="footer-link" style="color: #0e4929ff; text-decoration: none; font-size: 14px; transition: all 0.3s ease;">Recomendations</a>
                            <a href="#" onclick="navigateTo('statistics'); return false;" class="footer-link" style="color: #0e4929ff; text-decoration: none; font-size: 14px; transition: all 0.3s ease;">Statistics</a>
                            <a href="#" onclick="navigateTo('profile'); return false;" class="footer-link" style="color: #0e4929ff; text-decoration: none; font-size: 14px; transition: all 0.3s ease;">Profile</a>
                        </div>
                    </div>
                    
                    <!-- Follow Us -->
                    <div class="fade-in">
                        <h4 class="font-headline" style="font-family: 'Poppins', sans-serif;  color: #0e4929ff; font-size: 18px; margin-bottom: 16px;">Follow Us</h4>
                        <div class="font-body" style="font-family: 'Poppins', sans-serif; display: flex; flex-direction: column; gap: 8px; color: #0e4929ff; font-size: 14px;">
                            <span>• Instagram: @laplastique.id</span>
                            <span>• TikTok: @laplastique.id</span>
                            <span>• Facebook: LA.PLASTIQUE</span>
                            <span>• X: @La_Plastique.id</span>
                            <span>• Threads: @laplastique.id</span>
                        </div>
                    </div>
                </div>
                
            </div>
        </footer>
    `;
}

// ===================================
// RENDER AUTH PAGE
// ===================================

function renderAuthPage() {
    const isLoginMode = authMode === 'login';
    return `
        <div style="min-height: 100vh; background: linear-gradient(135deg, ${config.surface_color} 0%, ${config.background_color} 100%); display: flex; align-items: center; justify-content: center; padding: 32px;">
            <div class="fade-in" style="background-color: ${config.background_color}; padding: 48px; border-radius: 24px; box-shadow: 0 12px 40px rgba(33, 139, 84, 0.2); max-width: 500px; width: 100%;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 64px; margin-bottom: -30px;">
                        <img src="logo la plastique.png" style="max-width: 100%; height: auto; border-radius: 12px; rgba(0,0,0,0.2);">
                    </div>
                    <h1 class="font-headline" style="font-size: 32px; font-weight: 700; color: ${config.text_color}; margin-bottom: -20px;">
                        ${isLoginMode ? 'Welcome Back!' : 'Join La Plastique'}
                    </h1>
                    <p style="font-size: 15px; font-family: 'Poppins', sans-serif; color: ${config.text_color}; opacity: 0.7; margin-bottom: 20;">${isLoginMode ? 'Login to track your plastic usage' : 'Start your journey to reduce plastic waste'}</p>
                </div>

                <form id="auth-form" onsubmit="handleAuth(event)" style="display: grid; gap: 20px; font-family: 'Poppins', sans-serif;">
                    ${!isLoginMode ? `
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: ${config.text_color};">Full Name</label>
                            <input type="text" id="name-input" required style="width: 100%; padding: 14px; border: 2px solid ${config.primary_action_color}; border-radius: 10px; font-size: 16px; background-color: ${config.surface_color}; color: ${config.text_color}; box-sizing: border-box;">
                        </div>
                    ` : ''}
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: ${config.text_color};">Email</label>
                        <input type="email" id="email-input" required style="width: 100%; padding: 14px; border: 2px solid ${config.primary_action_color}; border-radius: 10px; font-size: 16px; background-color: ${config.surface_color}; color: ${config.text_color}; box-sizing: border-box;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: ${config.text_color};">Password</label>
                        <input type="password" id="password-input" required minlength="6" style="width: 100%; padding: 14px; border: 2px solid ${config.primary_action_color}; border-radius: 10px; font-size: 16px; background-color: ${config.surface_color}; color: ${config.text_color}; box-sizing: border-box;">
                    </div>
                    <button type="submit" class="btn-hover" style="background-color: ${config.primary_action_color}; color: white; padding: 16px; border: none; border-radius: 12px; font-size: 18px; font-weight: 700; cursor: pointer; margin-top: 10px;">
                        ${isLoginMode ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div style="font-family: 'Poppins', sans-serif; margin-top: 24px; text-align: center; padding-top: 24px; border-top: 2px solid rgba(33, 139, 84, 0.1);">
                    <p style="color: ${config.text_color}; opacity: 0.7; margin-bottom: 12px;">${isLoginMode ? "Don't have an account?" : 'Already have an account?'}</p>
                    <button onclick="toggleAuthMode()" style="background: transparent; color: ${config.primary_action_color}; border: 2px solid ${config.primary_action_color}; padding: 12px 32px; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer;">
                        ${isLoginMode ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===================================
// RENDER HOME PAGE
// ===================================

function renderHomePage() {
    return `
        <div style="min-height: 100vh; background-color: ${config.surface_color}; margin: 0; padding: 0;">
            ${renderNavigation()}
            
            <!-- Hero Section -->
            <section class="animate-section" style="background-color: #FFFFFF; padding: 60px 0;">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 32px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center;">
                        <div class="fade-in">
                            <h1 class="hero-title">
                                <span class="hero-title-dark">
                                    ${config.hero_title.split(',')[0]}
                                </span>
                                <span class="hero-title-green">
                                    ${config.hero_title.split(',')[1]}
                                </span>
                            </h1>


                            <p class="font-headline" style=" font-family: 'Preahvihear', sans-serif; font-size: 16px; margin-bottom: 28px; color: #000000; line-height: 1.7;">
                                Monitor your daily plastic use and get smart recycling tips and creative upcycling ideas tailored to your habits
                            </p>
                            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                <button onclick="navigateTo('tracker')" class="btn-animated" style="background-color: ${config.primary_action_color}; color: white; padding: 14px 28px; border: none; border-radius: 6px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                                    Start Tracking
                                </button>
                                <button onclick="navigateTo('about')" class="btn-animated" style="background-color: white; color: #333; padding: 14px 28px; border: none; border-radius: 6px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: center;" class="fade-in-right">
                            <img src="HOME PAGE PICTURE TRASH BIN.png" alt="Recycling bin with plastic" style="max-width: 80%; height: auto; border-radius: 12px; rgba(0,0,0,0.2);">
                        </div>
                    </div>
                </div>
            </section>

            <!-- Why Plastic Consumption Matters Section -->
            <section class="animate-section" style="background-color: #218B54; padding: 60px 0;">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 32px;">
                    <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 50px; align-items: center;">
                        <div class="fade-in-left">
                            <img src="GAMBAR MAIN PAGE 2.png" alt="Plastic waste pile" style="max-width: 100%; height: auto; border-radius: 12px;">
                        </div>
                        <div class="fade-in-right">
                            <h2 class="font-headline" style="font-family: 'Preahvihear', sans-serif; font-size: 36px; font-weight: 700; margin-bottom: 20px; color: white;">
                                Why Plastic Consumption Matters??
                            </h2>
                            <p class="font-body" style="font-family: 'Poppins', sans-serif; font-size: 16px; line-height: 1.8; color: rgba(255,255,255,0.95);">
                                Plastic waste continues to grow every year, affecting oceans, wildlife, and human health. By understanding our daily plastic habits, we can make smarter decisions that reduce environmental harm and contribute to a more sustainable future.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- What Is La Plastique Section -->
            <section class="animate-section" style="background-color: #CFF0DE; padding: 70px 0;">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 32px;">
                    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 50px; align-items: center;">
                        <div class="fade-in-left">
                            <h2 class="font-headline" style="font-family: 'Preahvihear', sans-serif; font-size: 36px; font-weight: 700; margin-bottom: 20px; color: #000000;">
                                What Is La Plastique?
                            </h2>
                            <p class="font-body" style="font-family: 'Poppins', sans-serif; font-size: 16px; line-height: 1.8; color: #000000;">
                                La Plastique is an AI-powered platform designed to help you track your daily plastic usage, discover sustainable alternatives, and receive actionable recycling recommendations. Our goal is to make responsible consumption simple, accessible, and meaningful for everyone.
                            </p>
                        </div>
                        <div style="display: flex; justify-content: center;" class="fade-in-right">
                            <img src="LOGO.png" alt="Logo with name" style="max-width: 70%; height: auto; border-radius: 12px; rgba(0,0,0,0.2);">
                        </div>
                    </div>
                </div>
            </section>

            <!-- How La Plastique Helps You Section -->
<section class="animate-section" style="background-color:#3CB371; padding:60px 0;">
  <div style="max-width:1200px; margin:0 auto; padding:0 20px;">
    
    <h2 class="font-headline fade-in"
        style="font-family:'Preahvihear',sans-serif;
               font-size:36px;
               font-weight:700;
               margin-bottom:40px;
               text-align:center;
               color:white;">
      How La Plastique Helps You??
    </h2>

    <div class="helps-grid">
      
      <div class="helps-card card-hover fade-in">
        <h3 class="font-headline">Track Your Usage</h3>
        <p class="font-body">
          Record your daily plastic items based on category and monitor your habits over time.
        </p>
      </div>

      <div class="helps-card card-hover fade-in">
        <h3 class="font-headline">View Your Progress</h3>
        <p class="font-body">
          Check your daily, weekly, and monthly consumption through interactive statistics.
        </p>
      </div>

      <div class="helps-card card-hover fade-in">
        <h3 class="font-headline">Get Smart Recommendations</h3>
        <p class="font-body">
          Receive personalized recycling tips and creative upcycling ideas based on what you use.
        </p>
      </div>

      <div class="helps-card card-hover fade-in">
        <h3 class="font-headline">Learn & Take Action</h3>
        <p class="font-body">
          Access educational content that supports eco-friendly living and SDG 12 initiatives.
        </p>
      </div>

    </div>
  </div>
</section>


            ${renderFooter()}
        </div>
    `;
}

// ===================================
// RENDER TRACKER PAGE
// ===================================

function renderTrackerPage() {
    const recentData = plasticData.slice().sort((a, b) => b.timestamp - a.timestamp);
    const aiSummary = generateAISummary();
    
    let recordsHTML = '';
    if (recentData.length === 0) {
        recordsHTML = `<p style="font-family: 'Poppins', sans-serif; text-align: center; color: ${config.text_color}; opacity: 0.6; padding: 40px;">No entries yet. Start tracking!</p>`;
    } else {
        recordsHTML = recentData.map(item => {
            const category = plasticCategories.find(c => c.id === item.category);
            const date = new Date(item.date);
            return `
                <div style="font-family: 'Poppins', sans-serif; display: flex; justify-content: space-between; align-items: center; padding: 16px; background-color: ${config.background_color}; border: 2px solid rgba(60, 179, 113, 0.2); border-radius: 12px; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-size: 32px;">${category ? category.icon : '📦'}</span>
                        <div>
                            <p style="font-weight: 700; margin: 0 0 4px 0; color: ${config.text_color};">${category ? category.name : 'Unknown'}</p>
                            <p style="font-size: 14px; color: ${config.text_color}; opacity: 0.7; margin: 0;">${date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} • ${item.quantity} items</p>
                        </div>
                    </div>
                    <button onclick="handleDeletePlastic('${item.id}')" style="color: #dc3545; border: 2px solid #dc3545; background: transparent; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        Delete
                    </button>
                </div>
            `;
        }).join('');
    }

    let insightsHTML = '';
    if (aiSummary.insights.length > 0) {
        insightsHTML = aiSummary.insights.map(insight => `
            <div style="font-family: 'Poppins', sans-serif; display: flex; gap: 12px; padding: 12px; background-color: ${config.surface_color}; border-radius: 8px; margin-bottom: 8px;">
                <span style="font-size: 20px;">${insight.icon}</span>
                <p style="color: ${config.text_color}; margin: 0; line-height: 1.6;">${insight.text}</p>
            </div>
        `).join('');
    }

    const categoryOptions = plasticCategories.map(cat => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`).join('');

    return `
        <div style="min-height: 100vh; background-color: ${config.background_color};">
            ${renderNavigation()}
            <div style="max-width: 1000px; margin: 0 auto; padding: 48px 32px;">
                <h1 class="font-headline" style="font-family: 'Preahvihear', sans-serif; text-align: center; font-size: 36px; font-weight: 700; margin-bottom: -10px; color: ${config.text_color};">Daily Plastic Usage Log</h1>
                <p style="font-family: 'Poppins', sans-serif; font-size: 16px; text-align: center; margin-bottom: 32px; color: ${config.text_color}; opacity: 0.8;">Add new records here</p>

                <div style="font-family: 'Poppins', sans-serif; background-color: ${config.surface_color}; padding: 32px; border-radius: 20px; margin-bottom: 32px;">
                    <form id="tracker-form" onsubmit="handleAddPlastic(event)" style="display: grid; gap: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: ${config.text_color};">Plastic Type</label>
                            <select id="category-select" required style="width: 100%; padding: 14px; border: 2px solid ${config.primary_action_color}; border-radius: 10px; font-size: 16px; background-color: ${config.background_color}; color: ${config.text_color}; box-sizing: border-box;">
                                ${categoryOptions}
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: ${config.text_color};">Quantity</label>
                            <input type="number" id="quantity-input" min="1" value="1" required style="width: 100%; padding: 14px; border: 2px solid ${config.primary_action_color}; border-radius: 10px; font-size: 16px; background-color: ${config.background_color}; color: ${config.text_color}; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: ${config.text_color};">Date</label>
                            <input type="date" id="date-input" required style="width: 100%; padding: 14px; border: 2px solid ${config.primary_action_color}; border-radius: 10px; font-size: 16px; background-color: ${config.background_color}; color: ${config.text_color}; box-sizing: border-box;">
                        </div>
                        <button type="submit" class="btn-hover" style="background-color: ${config.primary_action_color}; color: white; padding: 16px; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer;">
                            Add Record
                        </button>
                    </form>
                </div>

                ${plasticData.length > 0 ? `
                    <div style="font-family: 'Poppins', sans-serif; background-color: ${config.surface_color}; padding: 32px; border-radius: 20px; margin-bottom: 32px; border-left: 5px solid ${config.primary_action_color};">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                            <span style="font-size: 36px;">🤖</span>
                            <h2 class="font-headline" style="font-size: 24px; font-weight: 700; margin: 0; color: ${config.text_color};">AI Summary</h2>
                        </div>
                        <div style="background-color: ${config.background_color}; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                            <p style="color: ${config.text_color}; line-height: 1.7; margin: 0 0 16px 0;">${aiSummary.overview}</p>
                            ${insightsHTML}
                        </div>
                        <button onclick="navigateTo('recommendation')" class="btn-hover" style="background-color: ${config.primary_action_color}; color: white; padding: 14px 28px; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer; width: 100%;">
                            Get Personalized Recommendations
                        </button>
                    </div>
                ` : ''}

                <div style="font-family: 'Poppins', sans-serif; background-color: ${config.surface_color}; padding: 32px; border-radius: 20px;">
                    <h2 class="font-headline" style="font-size: 24px; font-weight: 700; margin-bottom: 24px; color: ${config.text_color};">📋 Record History (${plasticData.length})</h2>
                    ${recordsHTML}
                </div>
            </div>
            ${renderFooter()}
        </div>
    `;
}

// ===================================
// RENDER RECOMMENDATION PAGE
// ===================================

function renderRecommendationPage() {
    const categoryOptions = plasticCategories.map(cat => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`).join('');
    
    let videoHTML = '';
    if (selectedVideos) {
        const category = plasticCategories.find(c => c.id === selectedVideos.categoryId);
        videoHTML = `
            <div class="fade-in" style="font-family: 'Poppins', sans-serif; background-color: ${config.surface_color}; padding: 32px; border-radius: 20px; margin-bottom: 32px;">
                <h2 class="font-headline" style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: ${config.text_color};">🎥 Recommended Videos</h2>
                <p style="color: ${config.text_color}; opacity: 0.8; margin-bottom: 24px;">Helpful videos about ${category ? category.name : 'plastic reduction'}</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
                    ${selectedVideos.videos.map(video => `
                        <div style="background-color: ${config.background_color}; border-radius: 12px; overflow: hidden;">
                            <div style="position: relative; padding-bottom: 56.25%; height: 0;">
                                <iframe src="${video.url}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                            </div>
                            <div style="padding: 16px;">
                                <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: ${config.text_color};">${video.title}</h3>
                                <p style="font-size: 14px; color: ${config.text_color}; opacity: 0.8;">${video.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    let recHTML = '';
    if (aiRecommendation) {
        const category = plasticCategories.find(c => c.id === aiRecommendation.category);
        const rec = aiRecommendation.recommendation;
        recHTML = `
            <div class="fade-in" style="font-family: 'Poppins', sans-serif; background-color: ${config.surface_color}; padding: 32px; border-radius: 20px;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                    <span style="font-size: 48px;">${category ? category.icon : '📦'}</span>
                    <div>
                        <h2 class="font-headline" style="font-size: 26px; font-weight: 700; margin: 0 0 4px 0; color: ${config.text_color};">${category ? category.name : 'Plastic'} Recommendations</h2>
                        <p style="color: ${config.text_color}; opacity: 0.7; margin: 0;">Usage Level: ${aiRecommendation.level.charAt(0).toUpperCase() + aiRecommendation.level.slice(1)}</p>
                    </div>
                </div>

                <div style="background-color: rgba(60, 179, 113, 0.15); padding: 20px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid ${config.primary_action_color};">
                    <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px; color: ${config.text_color};">📊 AI Assessment</h3>
                    <p style="color: ${config.text_color}; margin: 0; line-height: 1.7;">${rec.assessment}</p>
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: ${config.text_color};">Personalized Tips</h3>
                    ${rec.tips.map(tip => `<div style="padding: 12px; background-color: ${config.background_color}; border-radius: 8px; margin-bottom: 8px; color: ${config.text_color};">✓ ${tip}</div>`).join('')}
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: ${config.text_color};">Sustainable Alternatives</h3>
                    ${rec.alternatives.map(alt => `<div style="padding: 12px; background-color: ${config.background_color}; border-radius: 8px; margin-bottom: 8px; color: ${config.text_color}; border: 2px solid ${config.primary_action_color};">🌱 ${alt}</div>`).join('')}
                </div>

                <div style="background-color: rgba(33, 139, 84, 0.15); padding: 20px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid ${config.secondary_action_color};">
                    <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px; color: ${config.text_color};">Recycling Ideas</h3>
                    <p style="color: ${config.text_color}; margin: 0; line-height: 1.7;">${rec.recycling}</p>
                </div>

                <div style="background: linear-gradient(135deg, ${config.primary_action_color}, ${config.secondary_action_color}); padding: 24px; border-radius: 12px; color: white;">
                    <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">🌍 Environmental Impact</h3>
                    <p style="margin: 0; line-height: 1.7;">${rec.impact}</p>
                </div>
            </div>
        `;
    }

    return `
        <div style="min-height: 100vh; background-color: ${config.background_color};">
            ${renderNavigation()}
            <div style="max-width: 1000px; margin: 0 auto; padding: 48px 32px;">
                <h1 class="font-headline" style= "font-family: 'Preahvihear', sans-serif; text-align: center; font-size: 36px; font-weight: 700; margin-bottom: -15px; color: ${config.text_color};">Recommendations</h1>
                <p style="font-family: 'Poppins', sans-serif; font-size: 16px; margin-bottom: 32px; text-align: center; color: ${config.text_color}; opacity: 0.8;">Plastic Management Recommendations by AI</p>

                <div style="background-color: ${config.surface_color}; padding: 32px; border-radius: 20px; margin-bottom: 32px;">
                    <form id="recommendation-form" onsubmit="handleGetRecommendation(event)" style="font-family: 'Poppins', sans-serif; display: grid; gap: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: ${config.text_color};">Plastic Type</label>
                            <select id="rec-category-select" required style="width: 100%; padding: 14px; border: 2px solid ${config.primary_action_color}; border-radius: 10px; font-size: 16px; background-color: ${config.background_color}; color: ${config.text_color}; box-sizing: border-box;">
                                ${categoryOptions}
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: ${config.text_color};">Usage Level</label>
                            <select id="usage-level-select" required style="width: 100%; padding: 14px; border: 2px solid ${config.primary_action_color}; border-radius: 10px; font-size: 16px; background-color: ${config.background_color}; color: ${config.text_color}; box-sizing: border-box;">
                                <option value="low">🟢 Low (1-5 items per week)</option>
                                <option value="medium">🟡 Medium (6-15 items per week)</option>
                                <option value="high">🔴 High (16+ items per week)</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-hover" style="background-color: ${config.primary_action_color}; color: white; padding: 16px; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer;">
                            Get Recommendations
                        </button>
                    </form>
                </div>

                ${videoHTML}
                ${recHTML}
            </div>
            ${renderFooter()}
        </div>
    `;
}

// ===================================
// RENDER STATISTICS PAGE
// ===================================

function renderStatisticsPage() {
    const totalCount = plasticData.length;
    const today = new Date();
    
    const thisWeek = plasticData.filter(item => {
        const itemDate = new Date(item.date);
        return Math.ceil(Math.abs(today - itemDate) / (1000 * 60 * 60 * 24)) <= 7;
    }).length;
    
    const thisMonth = plasticData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
    }).length;

    const categoryCounts = plasticCategories.map(cat => ({
        ...cat,
        count: plasticData.filter(item => item.category === cat.id).length
    }));
    const maxCount = Math.max(...categoryCounts.map(c => c.count), 1);

    const usageChartData = getUsageChartData(selectedTimeframe);
    const insights = generateInsights();
    const summary = generateSummary();
    const trendAnalysis = generateTrendAnalysis();

    let chartHTML = '';
    if (usageChartData.length > 0) {
        const maxValue = Math.max(...usageChartData.map(d => d.value), 1);
        chartHTML = usageChartData.map(item => {
            const heightPercent = (item.value / maxValue * 100);
            return `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <span style="font-size: 14px; font-weight: 700; color: ${config.text_color};">${item.value}</span>
                    <div style="width: 100%; background: linear-gradient(180deg, ${config.primary_action_color}, ${config.secondary_action_color}); height: ${Math.max(heightPercent * 2, item.value > 0 ? 20 : 0)}px; border-radius: 8px 8px 0 0;"></div>
                    <span style="font-size: 12px; color: ${config.text_color}; opacity: 0.7;">${item.label}</span>
                </div>
            `;
        }).join('');
    }

    let categoryDistHTML = categoryCounts.map(cat => {
        const percentage = totalCount > 0 ? (cat.count / totalCount * 100).toFixed(1) : 0;
        const barWidth = maxCount > 0 ? (cat.count / maxCount * 100) : 0;
        return `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 28px;">${cat.icon}</span>
                        <span style="font-weight: 700; color: ${config.text_color};">${cat.name}</span>
                    </div>
                    <span style="font-weight: 700; color: ${config.text_color};">${cat.count} (${percentage}%)</span>
                </div>
                <div style="background-color: ${config.background_color}; height: 32px; border-radius: 8px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, ${config.primary_action_color}, ${config.secondary_action_color}); height: 100%; width: ${barWidth}%; border-radius: 8px;"></div>
                </div>
            </div>
        `;
    }).join('');

    let insightsHTML = insights.map(insight => `
        <div style="display: flex; gap: 12px; padding: 12px; background-color: ${config.surface_color}; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid ${config.primary_action_color};">
            <span style="font-size: 24px;">${insight.icon}</span>
            <p style="color: ${config.text_color}; margin: 0; line-height: 1.6;">${insight.text}</p>
        </div>
    `).join('');

    let trendsHTML = trendAnalysis.map(trend => `
        <div style="padding: 16px; background-color: ${config.surface_color}; border-radius: 8px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-weight: 700; color: ${config.text_color};">${trend.label}</span>
                <span style="font-size: 24px;">${trend.trend === 'up' ? '📈' : trend.trend === 'down' ? '📉' : '➡️'}</span>
            </div>
            <p style="color: ${config.text_color}; opacity: 0.8; margin: 0;">${trend.description}</p>
        </div>
    `).join('');

    return `
        <div style="min-height: 100vh; background-color: ${config.background_color};">
            ${renderNavigation()}
            <div style="max-width: 1000px; margin: 0 auto; padding: 48px 32px;">
                <h1 class="font-headline" style="font-family: 'Preahvihear', sans-serif; text-align: center; font-size: 36px; font-weight: 700; margin-bottom: -15px; color: ${config.text_color};">Statistics</h1>
                <p style="font-family: 'Poppins', sans-serif; font-size: 16px; text-align: center; margin-bottom: 32px;  color: ${config.text_color}; opacity: 0.8;">Your Plastic Usage Overview</p>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; font-family: 'Poppins', sans-serif;">
                    <div style="background-color: ${config.surface_color}; padding: 24px; border-radius: 16px; text-align: center;">
                        <p style="font-size: 14px; color: ${config.text_color}; opacity: 0.7; margin-bottom: 8px;">Total Entries</p>
                        <p class="font-headline" style="font-size: 40px; font-weight: 700; color: ${config.text_color}; margin: 0;">${totalCount}</p>
                    </div>
                    <div style="background-color: ${config.surface_color}; padding: 24px; border-radius: 16px; text-align: center;">
                        <p style="font-size: 14px; color: ${config.text_color}; opacity: 0.7; margin-bottom: 8px;">This Week</p>
                        <p class="font-headline" style="font-size: 40px; font-weight: 700; color: ${config.text_color}; margin: 0;">${thisWeek}</p>
                    </div>
                    <div style="background-color: ${config.surface_color}; padding: 24px; border-radius: 16px; text-align: center;">
                        <p style="font-size: 14px; color: ${config.text_color}; opacity: 0.7; margin-bottom: 8px;">This Month</p>
                        <p class="font-headline" style="font-size: 40px; font-weight: 700; color: ${config.text_color}; margin: 0;">${thisMonth}</p>
                    </div>
                </div>

                ${totalCount > 0 ? `
                    <div style="background-color: ${config.surface_color}; padding: 32px; border-radius: 20px; margin-bottom: 32px;">
                        <h2 class="font-headline" style="font-family: 'Preahvihear', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 24px; color: ${config.text_color};">Usage Overview</h2>
                        
                        <div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">
                            <button onclick="changeTimeframe('daily')" style="background-color: ${selectedTimeframe === 'daily' ? config.primary_action_color : config.background_color}; color: ${selectedTimeframe === 'daily' ? 'white' : config.text_color}; padding: 10px 20px; border: 2px solid ${config.primary_action_color}; border-radius: 8px; font-weight: 600; cursor: pointer;">📅 Daily</button>
                            <button onclick="changeTimeframe('monthly')" style="background-color: ${selectedTimeframe === 'monthly' ? config.primary_action_color : config.background_color}; color: ${selectedTimeframe === 'monthly' ? 'white' : config.text_color}; padding: 10px 20px; border: 2px solid ${config.primary_action_color}; border-radius: 8px; font-weight: 600; cursor: pointer;">📆 Monthly</button>
                            <button onclick="changeTimeframe('yearly')" style="background-color: ${selectedTimeframe === 'yearly' ? config.primary_action_color : config.background_color}; color: ${selectedTimeframe === 'yearly' ? 'white' : config.text_color}; padding: 10px 20px; border: 2px solid ${config.primary_action_color}; border-radius: 8px; font-weight: 600; cursor: pointer;">📊 Yearly</button>
                        </div>

                        <div style="font-family: 'Poppins', sans-serif; background-color: ${config.background_color}; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 20px; color: ${config.text_color};">Usage Trend - ${selectedTimeframe.charAt(0).toUpperCase() + selectedTimeframe.slice(1)}</h3>
                            <div style="display: flex; align-items: flex-end; gap: 12px; height: 200px; padding: 20px 0;">
                                ${chartHTML || '<p style="text-align: center; width: 100%; color: ' + config.text_color + '; opacity: 0.6;">No data for this timeframe</p>'}
                            </div>
                        </div>

                        <div style="font-family: 'Poppins', sans-serif; background-color: ${config.background_color}; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 16px; color: ${config.text_color};">💡 Key Insights</h3>
                            ${insightsHTML || '<p style="color: ' + config.text_color + '; opacity: 0.6;">No insights available yet.</p>'}
                        </div>

                        <div style="font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, ${config.primary_action_color}, ${config.secondary_action_color}); padding: 24px; border-radius: 12px; color: white; margin-bottom: 24px;">
                            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">📋 Summary</h3>
                            <p style="margin: 0; line-height: 1.7;">${summary}</p>
                        </div>

                        <div style="font-family: 'Poppins', sans-serif; background-color: ${config.background_color}; padding: 24px; border-radius: 12px;">
                            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 16px; color: ${config.text_color};">📊 Trend Analysis</h3>
                            ${trendsHTML || '<p style="color: ' + config.text_color + '; opacity: 0.6;">Not enough data for trends.</p>'}
                        </div>
                    </div>
                ` : ''}

                <div style="background-color: ${config.surface_color}; padding: 32px; border-radius: 20px;">
                    <h2 class="font-headline" style="font-size: 24px; font-weight: 700; margin-bottom: 24px; color: ${config.text_color};">Distribution by Category</h2>
                    ${totalCount === 0 ? `<p style="text-align: center; color: ${config.text_color}; opacity: 0.6; padding: 40px;">No data yet. Start tracking!</p>` : categoryDistHTML}
                </div>
            </div>
            ${renderFooter()}
        </div>
    `;
}

// ===================================
// RENDER PROFILE PAGE
// ===================================

function renderProfilePage() {
    const totalPlastic = plasticData.length;
    const daysTracked = new Set(plasticData.map(item => item.date)).size;
    
    let badgesHTML = '';
    if (totalPlastic >= 10) {
        badgesHTML += `<div style="text-align: center; padding: 16px; border: 3px solid ${config.primary_action_color}; border-radius: 12px; background-color: ${config.background_color};"><div style="font-size: 48px; margin-bottom: 8px;">🌟</div><p style="font-weight: 700; color: ${config.text_color}; margin: 0;">Beginner</p></div>`;
    }
    if (totalPlastic >= 50) {
        badgesHTML += `<div style="text-align: center; padding: 16px; border: 3px solid ${config.primary_action_color}; border-radius: 12px; background-color: ${config.background_color};"><div style="font-size: 48px; margin-bottom: 8px;">💚</div><p style="font-weight: 700; color: ${config.text_color}; margin: 0;">Eco Conscious</p></div>`;
    }
    if (totalPlastic >= 100) {
        badgesHTML += `<div style="text-align: center; padding: 16px; border: 3px solid ${config.primary_action_color}; border-radius: 12px; background-color: ${config.background_color};"><div style="font-size: 48px; margin-bottom: 8px;">🏆</div><p style="font-weight: 700; color: ${config.text_color}; margin: 0;">Champion</p></div>`;
    }
    if (totalPlastic < 10) {
        badgesHTML = `<p style="text-align: center; color: ${config.text_color}; opacity: 0.6; padding: 24px;">Keep tracking to earn badges!</p>`;
    }

    return `
        <div style="min-height: 100vh; background-color: ${config.background_color};">
            ${renderNavigation()}
            <div style="max-width: 800px; margin: 0 auto; padding: 48px 32px;">
                <h1 class="font-headline" style="font-family: 'Preahvihear', sans-serif; text-align: center; font-size: 36px; font-weight: 700; margin-bottom: 32px; color: ${config.text_color};">User Profile</h1>

                <div style="font-family: 'Poppins', sans-serif; background-color: ${config.surface_color}; padding: 32px; border-radius: 20px; margin-bottom: 24px;">
                    <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 32px;">
                        <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, ${config.primary_action_color}, ${config.secondary_action_color}); display: flex; align-items: center; justify-content: center; font-size: 48px;">👤</div>
                        <div>
                            <h2 class="font-headline" style="font-size: 28px; font-weight: 700; margin: 0 0 8px 0; color: ${config.text_color};">${currentUser ? currentUser.name : 'User'}</h2>
                            <p style="color: ${config.text_color}; opacity: 0.7; margin: 0;">${currentUser ? currentUser.email : 'user@example.com'}</p>
                        </div>
                    </div>

                    <div style="border-top: 2px solid rgba(60, 179, 113, 0.2); padding-top: 24px;">
                        <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 16px; color: ${config.text_color};">Account Information</h3>
                        <div style="display: grid; gap: 12px;">
                            <div style="display: flex; justify-content: space-between; padding: 14px; background-color: ${config.background_color}; border-radius: 8px;">
                                <span style="color: ${config.text_color}; opacity: 0.7;">Total Entries</span>
                                <span style="font-weight: 700; color: ${config.text_color};">${totalPlastic} items</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 14px; background-color: ${config.background_color}; border-radius: 8px;">
                                <span style="color: ${config.text_color}; opacity: 0.7;">Days Tracking</span>
                                <span style="font-weight: 700; color: ${config.text_color};">${daysTracked} days</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 14px; background-color: ${config.background_color}; border-radius: 8px;">
                                <span style="color: ${config.text_color}; opacity: 0.7;">Member Since</span>
                                <span style="font-weight: 700; color: ${config.text_color};"> ${currentUser?.memberSince || '-'}</span>

                            </div>
                        </div>
                    </div>
                </div>

                <div style="font-family: 'Poppins', sans-serif; background-color: ${config.surface_color}; padding: 32px; border-radius: 20px; margin-bottom: 24px;">
                    <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 20px; color: ${config.text_color};">🏆 Achievement Badges</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px;">
                        ${badgesHTML}
                    </div>
                </div>

                <div style="font-family: 'Poppins', sans-serif; background-color: ${config.surface_color}; padding: 32px; border-radius: 20px;">
                    <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 20px; color: ${config.text_color};">Account Settings</h3>
                    <div style="display: grid; gap: 12px;">
                        <button onclick="showToast('Profile editing coming soon!')" style="color: ${config.secondary_action_color}; border: 2px solid ${config.secondary_action_color}; background: transparent; padding: 14px; border-radius: 10px; font-weight: 600; cursor: pointer; text-align: left;">
                            ✏️ Edit Profile
                        </button>
                        <button onclick="handleLogout()" style="color: #dc3545; border: 2px solid #dc3545; background: transparent; padding: 14px; border-radius: 10px; font-weight: 600; cursor: pointer; text-align: left;">
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>
            ${renderFooter()}
        </div>
    `;
}

// ===================================
// RENDER ABOUT PAGE
// ===================================

function renderAboutPage() {
  return `
  <div style="background:#fff;">
    ${renderNavigation()}

    <!-- HERO ABOUT -->
<section style="background:#EAF7F0; padding:80px 0;">
  <div style="
    max-width:1000px;
    margin:0 auto;
    padding:0 24px;
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:48px;
    align-items:center;
  ">

    <!-- TEXT -->
    <div style="max-width:420px; margin:0 auto;">
      <h1 style="
        font-family:'Preahvihear',sans-serif;
        font-size:42px;
        margin:0 0 16px;
        color:#333;
      ">
        About La Plastique
      </h1>

      <p style="
        font-family:'Poppins', sans-serif;
        font-size:16px;
        line-height:1.8;
        color:#333;
        margin:0;
      ">
        La Plastique was created to help users track their daily plastic usage
        and provide personalized AI-based recommendations for recycling,
        upcycling, and reducing plastic consumption.
      </p>
    </div>

    <!-- IMAGE -->
    <div style="display:flex; justify-content:center;">
      <img src="about 1.png" style="
        width:100%;
        max-width:360px;
        border-radius:16px;
      ">
    </div>

  </div>
</section>


    <!-- PLASTIC WASTE -->
<section style="background:#218B54; padding:80px 0; color:white;">
  <div style="
    max-width:1000px;
    margin:0 auto;
    padding:0 24px;
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:48px;
    align-items:center;
  ">

    <!-- TEXT -->
    <div style="max-width:420px; margin:0 auto;">
      <h2 style="
        font-family:'Preahvihear',sans-serif;
        font-size:36px;
        margin-bottom:16px;
      ">
        Plastic Waste
      </h2>

      <p style="
        font-family:'Poppins', sans-serif;
        line-height:1.8;
        font-size:16px;
        margin:0;
      ">
        Plastic waste has become one of the biggest environmental challenges
        worldwide. Millions of tons end up in landfills, rivers, and oceans
        every year, causing serious harm to ecosystems and human health.
      </p>
    </div>

    <!-- IMAGE -->
    <div style="display:flex; justify-content:center;">
      <img src="about 2.png" style="
        width:100%;
        max-width:340px;
        border-radius:16px;
      ">
    </div>

  </div>
</section>


    <!-- PROJECT OBJECTIVES -->
    <section style="background:#EEF6EF; padding:90px 0;">
      <h2 style="text-align:center;
                 font-family:'Preahvihear',sans-serif;
                 font-size:32px;
                 margin-bottom:48px;">
        Project Objectives
      </h2>

      <div style="font-family: 'Poppins', sans-serif; max-width:1100px; margin:0 auto; padding:0 32px;
                  display:grid; grid-template-columns:repeat(3,1fr); gap:32px;">
        ${objectiveCard(
          "Educate the public about proper plastic management and recycling.",
          "PO 1.png"
        )}
        ${objectiveCard(
          "Simplify the process of upcycling and reusing plastics.",
          "PO 2.png"
        )}
        ${objectiveCard(
          "Encourage active participation in reducing plastic waste.",
          "PO 3.png"
        )}
      </div>
    </section>

    <!-- OUR VISION -->
<section style="padding:80px 0;">
  <div style="
    max-width:1000px;
    margin:0 auto;
    padding:0 20px;
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:48px;
    align-items:center;
  ">

    <!-- TEXT -->
    <div style="
      max-width:420px;
      margin:0 auto;
    ">
      <h2 style="
        font-family:'Preahvihear',sans-serif;
        font-size:32px;
        color:#C47A00;
        margin-bottom:12px;
      ">
        Our Vision
      </h2>

      <p style="
        font-family:'Poppins', sans-serif;
        font-size:16px;
        line-height:1.8;
        color:#333;
        margin:0;
      ">
        To build a cleaner and more sustainable future where everyone
        is empowered to manage plastic responsibly.
      </p>
    </div>

    <!-- IMAGE -->
    <div style="
      display:flex;
      justify-content:center;
    ">
      <img src="VISI.png" style="
        width:100%;
        max-width:360px;
        border-radius:16px;
      ">
    </div>

  </div>
</section>


   <!-- OUR MISSION -->
<section style="background:#218B54; padding:80px 0; color:white;">
  <div style="
    max-width:1000px;
    margin:0 auto;
    padding:0 20px;
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:48px;
    align-items:center;
  ">

    <!-- IMAGE -->
    <div style="display:flex; justify-content:center;">
      <img src="MISI.png" style="
        width:100%;
        max-width:360px;
        border-radius:18px;
        object-fit:cover;
        box-shadow:0 14px 40px rgba(0,0,0,0.22);
      ">
    </div>

    <!-- TEXT -->
    <div style="
      max-width:420px;
      margin:0 auto;
      display:flex;
      flex-direction:column;
      justify-content:center;
    ">
      <h2 style="
        font-family:'Preahvihear',sans-serif;
        font-size:32px;
        margin:0 0 16px;
        color:#fff;
      ">
        Our Mission
      </h2>

      <ul style="
        font-family:'Poppins', sans-serif;
        font-size:16px;
        line-height:1.9;
        margin:0;
        padding-left:18px;
      ">
        <li style="margin-bottom:10px;">Educate users about plastic types and impacts</li>
        <li style="margin-bottom:10px;">Provide AI-based personalized recommendations</li>
        <li style="margin-bottom:10px;">Support SDG 12 and responsible consumption</li>
        <li>Make sustainability simple and accessible</li>
      </ul>
    </div>

  </div>
</section>



    ${renderFooter()}
  </div>
  `;
}

function objectiveCard(text, img) {
  return `
    <div style="background:white;
                border-radius:20px;
                padding:24px;
                text-align:center;
                box-shadow:0 10px 30px rgba(0,0,0,0.08);">
      <p style="margin-bottom:16px; font-size:15px;">${text}</p>
      <img src="${img}" style="width:100%; border-radius:14px;">
    </div>
  `;
}


// ===================================
// EVENT HANDLERS
// ===================================

function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';
    renderPage('auth');
}

function handleAuth(event) {
    event.preventDefault();

    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const isLoginMode = authMode === 'login';

    // cari user
    const existingUser = users.find(u => u.email === email);

    /* =====================
       LOGIN MODE
       ===================== */
    if (isLoginMode) {
        if (!existingUser) {
            showToast('❌ Account not found. Please sign up first.');
            authMode = 'signup';
            renderPage('auth');
            return;
        }

        // login sukses
        currentUser = existingUser;
        isLoggedIn = true;
        saveToLocalStorage();
        showToast('✅ Login successful!');
        renderPage('home');
        return;
    }

    /* =====================
       SIGN UP MODE
       ===================== */
    const name = document.getElementById('name-input').value;

    if (existingUser) {
        showToast('⚠️ Account already exists. Please login.');
        authMode = 'login';
        renderPage('auth');
        return;
    }

    // buat user baru
    const newUser = {
        email,
        name,
        password,
        memberSince: new Date().getFullYear()
    };

    users.push(newUser);
    saveUsers();

    currentUser = newUser;
    isLoggedIn = true;
    saveToLocalStorage();

    showToast('🎉 Account created successfully!');
    renderPage('home');
}

function handleLogout() {
    isLoggedIn = false;
    currentUser = null;
    saveToLocalStorage();
    showToast('👋 Logged out successfully!');
    renderPage('auth');
}

function handleAddPlastic(event) {
    event.preventDefault();
    
    if (plasticData.length >= 999) {
        showToast('⚠️ Maximum 999 entries reached!');
        return;
    }
    
    const category = document.getElementById('category-select').value;
    const quantity = parseInt(document.getElementById('quantity-input').value);
    const date = document.getElementById('date-input').value;
    
    const newRecord = {
        id: Date.now().toString(),
        category: category,
        quantity: quantity,
        date: date,
        timestamp: Date.now()
    };
    
    plasticData.push(newRecord);
    saveToLocalStorage();
    showToast('✅ Entry saved!');
    renderPage('tracker');
}

function handleDeletePlastic(id) {
    const index = plasticData.findIndex(item => item.id === id);
    if (index !== -1) {
        plasticData.splice(index, 1);
        saveToLocalStorage();
        showToast('✅ Entry deleted!');
        renderPage('tracker');
    }
}

function handleGetRecommendation(event) {
    event.preventDefault();
    
    const category = document.getElementById('rec-category-select').value;
    const level = document.getElementById('usage-level-select').value;
    
    selectedVideos = {
        categoryId: category,
        videos: videoRecommendations[category]
    };
    
    aiRecommendation = {
        category: category,
        level: level,
        recommendation: aiRecommendations[category][level]
    };
    
    renderPage('recommendation');
    
    setTimeout(() => {
        const videoDiv = document.getElementById('video-recommendations');
        if (videoDiv) {
            videoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

function changeTimeframe(timeframe) {
    selectedTimeframe = timeframe;
    renderPage('statistics');
}

function showToast(message) {
    const existingToast = document.getElementById('toast-message');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.id = 'toast-message';
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 32px;
        background-color: #218B54;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        font-family: 'Poppins', sans-serif;
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===================================
// PAGE RENDERING & NAVIGATION
// ===================================

function renderPage(page) {
    currentPage = page;
    const app = document.getElementById('app');

    if (!isLoggedIn && page !== 'auth') {
        app.innerHTML = renderAuthPage();
        reinitAnimations();   
        return;
    }

    switch(page) {
        case 'auth':
            app.innerHTML = renderAuthPage();
            break;
        case 'home':
            app.innerHTML = renderHomePage();
            break;
        case 'tracker':
            app.innerHTML = renderTrackerPage();
            setTimeout(() => {
                const dateInput = document.getElementById('date-input');
                if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
            }, 0);
            break;
        case 'recommendation':
            app.innerHTML = renderRecommendationPage();
            break;
        case 'statistics':
            app.innerHTML = renderStatisticsPage();
            break;
        case 'profile':
            app.innerHTML = renderProfilePage();
            break;
        case 'about':
            app.innerHTML = renderAboutPage();
            break;
        default:
            app.innerHTML = renderHomePage();
    }

    reinitAnimations();
}


function navigateTo(page) {
    if (!isLoggedIn && page !== 'auth') {
        redirectAfterLogin = page; // simpan tujuan
        showToast('🔒 Please login first');
        renderPage('auth');
        return;
    }

    renderPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ===================================
// APP INITIALIZATION
// ===================================

function initApp() {
    loadUsers();       
    loadFromLocalStorage();

    if (isLoggedIn) {
        renderPage('home');
    } else {
        renderPage('auth');
    }

    initScrollAnimations();
}


// Scroll Animation Observer
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animasi sekali saja
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  document.querySelectorAll("section").forEach(section => {
    observer.observe(section);
  });
}

function reinitAnimations() {
  setTimeout(() => {
    initScrollAnimations();
  }, 100);
}


// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initScrollAnimations() {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.15 }
    );

    document.querySelectorAll(".animate-section").forEach(section => {
        observer.observe(section);
    });
}

function reinitAnimations() {
    setTimeout(initScrollAnimations, 100);
}
