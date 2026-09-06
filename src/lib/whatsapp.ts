/**
 * Pawnastaycation WhatsApp link generator utility
 */

export function buildWhatsAppUrl(
  phoneNumber?: string,
  messageText: string = ''
): string {
  let cleanedPhone = (phoneNumber || '918793020527').replace(/[^0-9]/g, '');
  if (cleanedPhone.length === 10) {
    cleanedPhone = '91' + cleanedPhone;
  }
  if (!cleanedPhone) {
    cleanedPhone = '918793020527';
  }
  const encodedMsg = messageText ? encodeURIComponent(messageText) : '';
  return encodedMsg ? `https://wa.me/${cleanedPhone}?text=${encodedMsg}` : `https://wa.me/${cleanedPhone}`;
}

export function buildStayEnquiryWhatsAppMsg(
  stayName: string,
  priceAmount?: number | null,
  checkIn?: string,
  checkOut?: string,
  guests?: number
): string {
  return `Hello Pawnastaycation,

I am interested in booking:

Accommodation: ${stayName}

Check-in: ${checkIn || '[Selected Date]'}
Check-out: ${checkOut || '[Selected Date]'}
Guests: ${guests || '[Number of Guests]'}

Please confirm availability and booking details.`;
}

export function buildPackageEnquiryWhatsAppMsg(
  packageName: string,
  checkIn?: string,
  checkOut?: string,
  guests?: number
): string {
  return `Hello Pawnastaycation,

I am interested in booking:

Package: ${packageName}

Check-in: ${checkIn || '[Selected Date]'}
Check-out: ${checkOut || '[Selected Date]'}
Guests: ${guests || '[Number of Guests]'}

Please confirm availability and booking details.`;
}

export function buildFormEnquiryWhatsAppMsg(params: {
  customerName: string;
  phone: string;
  itemName: string;
  checkIn: string;
  checkOut: string;
  guests: number | string;
  message?: string;
}): string {
  return `Hello Pawnastaycation,

I would like to enquire about a booking.

Name: ${params.customerName}
Phone: ${params.phone}
Stay/Package: ${params.itemName}
Check-in: ${params.checkIn || '[Selected Date]'}
Check-out: ${params.checkOut || '[Selected Date]'}
Guests: ${params.guests || '[Number of Guests]'}

Additional Message:
${params.message || 'None'}

Please confirm availability and booking details.`;
}

export function buildGeneralEnquiryWhatsAppMsg(): string {
  return `Hello Pawnastaycation, I want to enquire about your Pawna Lake stay. Please share availability and booking details.`;
}
