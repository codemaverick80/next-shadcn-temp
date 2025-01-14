import {getAccountByGoogleId} from "@/app-db-access/account.data-access";


export async function getAccountByGoogleIdService(googleId: string) {
    return await getAccountByGoogleId(googleId);
}