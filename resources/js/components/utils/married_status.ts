const marriedStatus = (status: string): string => {
  switch(status) {
    case 'not_married':
      return 'Belum Menikah'
    case 'married':
      return 'Menikah';
    case 'divorced':
      return 'Bercerai';
    default:
      return '-'
  }
}
export default marriedStatus;