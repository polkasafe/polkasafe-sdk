export const responseMessages = {
    missing_user_signatory:
        'User address should be in the list of signatories.',
    missing_headers: 'Missing headers.',
    invalid_headers: 'Invalid headers.',
    missing_params: 'Missing parameters.',
    invalid_params: 'Invalid parameters passed to the function call.',
    invalid_signature: 'Invalid signature.',
    invalid_network: 'Invalid network.',
    unauthorised: 'Unauthorised.',
    internal: 'Internal error occured.',
    min_singatories: 'Minimum number of signatories is 2.',
    invalid_threshold:
        'Threshold should be a number less than or equal to the number of signatories.',
    multisig_exists: 'Multisig already exists. Please try linking it.',
    multisig_create_error: 'Error while creating multisig.',
    onchain_multisig_fetch_error: 'Error while fetching multisig from chain.',
    multisig_not_found: 'Multisig not found.',
    multisig_not_found_on_chain: 'Multisig not found on chain.',
    network_not_supported: 'unsupported network',
    duplicate_signatories: 'Duplicate signatories.',
    invalid_limit:
        'Min. and max. limit that can be fetched per page is 1 and 100 respectively.',
    invalid_page: 'Min. value for page is 1.',
    transfers_fetch_error: 'Error while fetching transfers.',
    queue_fetch_error: 'Error while fetching queue.',
    assets_fetch_error: 'Error while fetching assets.',
    success: 'Success',
};
