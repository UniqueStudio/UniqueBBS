import {CronJob} from 'cron';

import {getUser} from './utils/getUser'

// run every Sunday
const task =
    async () => {
  try {
    const job = new CronJob('0 0 * * 0', async () => { await getUser(); })
    job.start();
  } catch (error) {
    console.log(error);
  }
}

export default task;
