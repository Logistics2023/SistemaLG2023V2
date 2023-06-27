function getDayMonthYear (setUserDayMonthYear) {

    // const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']      
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    const days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31',]


    const date = new Date();
    
    return `${days[date.getDate()-1]}-${months[date.getMonth()]}-${date.getUTCFullYear()}`
    
}

export {getDayMonthYear, }
