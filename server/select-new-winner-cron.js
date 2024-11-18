import cron from 'node-cron';
import axios from 'axios';

// Schedule the task to run every minute
cron.schedule('* * * * *', async () => {
    try {
        console.log('Running cron job to select new winners from expired bids...');

        const expiredBidsResponse = await axios.post(process.env.BASE_URL + '/api/select-new-winner');
        console.log('Expired bids processed:', expiredBidsResponse.data);
    } catch (error) {
        console.error('Error triggering new winner selection task:', error);
    }
});
