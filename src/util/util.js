import storageService from "@/core/storage"

export const getOrganizationId = () => {

    const user = JSON.parse(storageService.get('user'))
    return user.organizationId;

    //return 'c1c011d3-e9db-4874-9d90-e267c64dd9da'   // dummy organization id


}