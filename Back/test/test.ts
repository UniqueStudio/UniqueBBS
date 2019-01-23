import * as dotenv from "dotenv";
dotenv.config();

import { updateGroup } from "../utils/getGroup";
import { getUser } from "../utils/getUser";

(async function() {
    await updateGroup();
    await getUser();
})();
