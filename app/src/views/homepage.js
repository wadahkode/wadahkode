const HomeStack = require('../resources/users').default;

function Homepage(data) {
    const Home = new HomeStack(data.pattern, data.users);
    
    Home.getComponent();
}

module.exports = Homepage;