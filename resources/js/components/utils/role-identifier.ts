const roleIdentifier = (role: string): string => {
    switch (role) {
        case 'Patient':
            return 'Pasien';
        case 'Midwife':
            return 'Bidan';
        case 'Admin':
            return 'Admin';
        case 'Super Admin':
            return 'Super Admin';
        default:
            return '-';
    }
};
export default roleIdentifier;
