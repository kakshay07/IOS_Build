export const validatePhoneNumber = (value : string | number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(value.toString()) || "Phone number must be exactly 10 digits";
};

export const validateEmail = ( value : string) => {
    if (!value) return true; 
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) || "Invalid email address";
}

export const isDateNotInFuture = (value :any) => {
    const selectedDate = new Date(value);
    const today = new Date();
    
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      return 'The selected date cannot be in the future';
    }
    return true;
};