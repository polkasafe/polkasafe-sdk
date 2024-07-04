import { handleHeaders } from "src/utils/handleHeaders";

type Props = {
    authCode: string,
    tfa_token: string,
}

export function handleValidate2FA({
    authCode,
    tfa_token,
}: Props) {
    if(!authCode || !tfa_token) throw new Error(`Missing required parameters for Validate2FA. authCode: ${authCode}, tfa_token: ${tfa_token}`)
    const body = JSON.stringify({
        authCode,
        tfa_token
    })
    return {
        endpoint: '/valid_2FA_code', headers:{}, options: { method: 'POST', body: body }
    }
}
