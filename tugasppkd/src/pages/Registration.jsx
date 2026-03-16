import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROOM_RATES = {
  'Standard Room': 500000,
  'Superior Room': 750000,
  'Deluxe Room': 1000000,
  'Executive Suite': 2500000
};

function Registration() {
  const { addGuest } = useAuth();
  const [formData, setFormData] = useState({
    roomNo: '',
    noOfPerson: 1,
    noOfRoom: 1,
    roomType: 'Standard Room',
    receptionist: '',

    name: '',
    profession: '',
    company: '',
    arrivalTime: '',
    arrivalDate: '',

    nationality: 'Indonesia',
    idNumber: '',
    birthDate: '',

    address: '',
    phone: '',
    departureDate: '',

    email: '',
    memberNo: '',

    safetyDepositBox: '',
    issuedBy: '',
    issueDate: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };

      // Auto assign room type based on room number
      if (name === 'roomNo' && value) {
        const num = parseInt(value);
        if (!isNaN(num)) {
          if (num > 600) newState.roomType = 'Executive Suite';
          else if (num > 400) newState.roomType = 'Deluxe Room';
          else if (num > 200) newState.roomType = 'Superior Room';
          else newState.roomType = 'Standard Room';
        }
      }

      return newState;
    });
  };

  const calculateNights = (arrival, departure) => {
    if (!arrival || !departure) return 1;
    const start = new Date(arrival);
    const end = new Date(departure);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nights = calculateNights(formData.arrivalDate, formData.departureDate);
    const roomRate = ROOM_RATES[formData.roomType] || 0;
    const rooms = parseInt(formData.noOfRoom) || 1;
    const totalAmount = nights * roomRate * rooms;

    // OFFLINE FEEL: ID generator lokal
    const bookingNo = 'PPKD-' + Math.floor(Math.random() * 900000 + 100000);

    const newGuest = {
      id: bookingNo,
      name: formData.name,
      phone: formData.phone,
      roomNo: formData.roomNo || 'TBA',
      roomType: formData.roomType,
      checkIn: formData.arrivalDate,
      checkOut: formData.departureDate,
      status: 'Checked In',
      total: totalAmount
    };

    // OFFLINE FEEL: Pasti sukses karena AuthContext langsung melempar { success: true }
    await addGuest(newGuest);

    setBookingDetails({
      ...formData,
      nights,
      roomRate,
      rooms,
      totalAmount,
      bookingNo: bookingNo,
      confirmDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    setIsSubmitted(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  if (isSubmitted && bookingDetails) {
    // GAMBAR 2: RESERVATION CONFIRMATION OUTPUT
    return (
      <div className="min-h-screen bg-slate-100 print:bg-white py-12 print:py-0 px-4 sm:px-6 lg:px-8 print:px-0 font-serif text-slate-800 flex flex-col items-center">

        {/* ACTION BUTTONS (Hidden in Print) */}
        <div className="w-full max-w-[800px] flex justify-end gap-3 mb-6 print:hidden">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-md shadow-sm text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Kembali ke Dashboard
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print Confirmation
          </button>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                roomNo: '',
                noOfPerson: 1,
                noOfRoom: 1,
                roomType: 'Standard Room',
                receptionist: '',
                name: '',
                profession: '',
                company: '',
                arrivalTime: '',
                arrivalDate: '',
                nationality: 'Indonesia',
                idNumber: '',
                birthDate: '',
                address: '',
                phone: '',
                departureDate: '',
                email: '',
                memberNo: '',
                safetyDepositBox: '',
                issuedBy: '',
                issueDate: ''
              });
            }}
            className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            New Registration
          </button>
        </div>

        {/* PRINTABLE A4 AREA */}
        <div className="w-full max-w-[800px] bg-white print:shadow-none shadow-xl min-h-[1100px] p-10 md:p-14 border border-slate-200 print:border-none relative">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 mb-2">
              <img src="/logo.jpeg" alt="PPKD Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <h1 className="text-xl font-bold tracking-widest uppercase mt-2">PPKD HOTEL</h1>
          </div>

          <h2 className="text-lg font-semibold mb-6 border-b-2 border-slate-800 pb-2 inline-block">Reservation Confirmation</h2>

          {/* TOP INFOS */}
          <div className="flex justify-between mb-8 text-sm">
            <div className="w-3/5 space-y-1">
              <div className="flex"><span className="w-32">To.</span><span>: {bookingDetails.name}</span></div>
              <div className="h-4"></div>
              <div className="flex"><span className="w-32">Company / Agent</span><span>: {bookingDetails.company || '-'}</span></div>
              <div className="flex"><span className="w-32">Booking No.</span><span>: <strong className="font-mono">{bookingDetails.bookingNo}</strong></span></div>
              <div className="flex"><span className="w-32">Book By</span><span>: {bookingDetails.receptionist || 'Self'}</span></div>
              <div className="flex"><span className="w-32">Phone</span><span>: {bookingDetails.phone}</span></div>
              <div className="flex"><span className="w-32">Email</span><span>: {bookingDetails.email}</span></div>
            </div>
            <div className="w-2/5 pl-8 space-y-1">
              <div className="h-6"></div> {/* Offset to align aesthetically */}
              <div className="flex"><span className="w-16">Telp</span><span>: (021) 314-1234</span></div>
              <div className="flex"><span className="w-16">Fax</span><span>: (021) 314-1235</span></div>
              <div className="flex"><span className="w-16">Email</span><span>: rsv@ppkdhotel.id</span></div>
              <div className="flex"><span className="w-16">Date</span><span>: {bookingDetails.confirmDate}</span></div>
            </div>
          </div>

          <hr className="border-slate-800 mb-6" />

          {/* GUEST & STAY DETAILS */}
          <div className="space-y-2 text-sm mb-8 relative">
            <div className="flex"><span className="w-40">First Name</span><span>: {bookingDetails.name}</span></div>
            <div className="flex"><span className="w-40">Arrival Date</span><span>: {bookingDetails.arrivalDate}</span></div>
            <div className="flex"><span className="w-40">Departure Date</span><span>: {bookingDetails.departureDate}</span></div>
            <div className="flex"><span className="w-40">Total Night</span><span>: {bookingDetails.nights} Night(s)</span></div>
            <div className="flex"><span className="w-40">Room/Unit Type</span><span>: {bookingDetails.roomType} ({bookingDetails.rooms} Room)</span></div>
            <div className="flex"><span className="w-40">Person Pax</span><span>: {bookingDetails.noOfPerson} Pax</span></div>
            <div className="flex"><span className="w-40">Room Rate Net (per Night)</span><span>: {formatCurrency(bookingDetails.roomRate)}</span></div>

            <div className="absolute right-0 bottom-0 bg-slate-100 p-4 border border-slate-300 rounded-sm">
              <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Total Estimasi</span>
              <span className="block text-xl font-bold text-slate-800">{formatCurrency(bookingDetails.totalAmount)}</span>
            </div>
          </div>

          <div className="text-sm space-y-4 mb-8 text-justify">
            <p>Please guarantee this booking with credit card number with clear copy of the card both sides and card holder signature in the column provided the copy of credit card both sides should be faxed to hotel fax number.</p>
            <p>Please settle your outstanding to or account:</p>

            <div className="ml-4 space-y-1">
              <div className="font-semibold">Bank Transfer</div>
              <div className="flex"><span className="w-40">Mandiri Account</span><span>: 123-00-4567890-1</span></div>
              <div className="flex"><span className="w-40">Mandiri Name Account</span><span>: PPKD HOTEL JAKARTA PUSAT</span></div>
            </div>
          </div>

          <hr className="border-slate-800 mb-6" />

          {/* CREDIT CARD GUARANTEE */}
          <div className="text-sm mb-12">
            <p className="mb-4">Reservation guaranteed by the following credit card:</p>
            <div className="space-y-3">
              <div className="flex"><span className="w-48">Card Number</span><span>: ................................................................</span></div>
              <div className="flex"><span className="w-48">Card holder name</span><span>: ................................................................</span></div>
              <div className="flex"><span className="w-48">Card Type</span><span>: ................................................................</span></div>
              <div className="flex items-center"><span className="w-48">Or by Bank Transfer to</span><span>: [ ] BCA &nbsp;&nbsp; [ ] Mandiri &nbsp;&nbsp; [ ] BNI</span></div>
              <div className="flex"><span className="w-48">Expired date/month/year</span><span>: ........ / ........ / ................</span></div>
              <div className="flex"><span className="w-48">Card holder signature</span><span>:</span></div>
            </div>
            <div className="w-64 border-b border-black mt-16 ml-48"></div> {/* Signature line */}
          </div>

          <hr className="border-slate-800 mb-6" />

          {/* POLICIES */}
          <div className="text-xs mb-16">
            <p className="font-semibold mb-2 underline">Cancellation policy:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Please note that check in time is 02.00 pm and check out time 12.00 pm.</li>
              <li>All non guarantined reservations will automatically be released on 6 pm.</li>
              <li>The Hotel will charge 1 night for guaranteed reservations that have not been canceling before the day of arrival. Please carefully note your cancellation number.</li>
            </ol>
          </div>

          {/* SIGNATURE SECTION */}
          <div className="mt-16 flex justify-between px-10">
            {/* Guest Signature */}
            <div className="text-center w-48">
              <div className="border-b border-black h-20 mb-2"></div>
              <p className="text-sm font-bold uppercase tracking-tight">( {bookingDetails.name} )</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Guest Signature</p>
            </div>

            {/* Front Office Signature */}
            <div className="text-center w-48">
              <div className="border-b border-black h-20 mb-2"></div>
              <p className="text-sm font-bold uppercase tracking-tight">( {bookingDetails.receptionist || 'Front Office'} )</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Front Office Signature</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GAMBAR 1: REGISTRATION INPUT FORM
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 flex justify-center">
      <div className="max-w-4xl w-full">

        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto flex items-center justify-center mb-3">
            <img src="/logo.jpeg" alt="PPKD Logo" className="w-full h-full object-contain rounded-lg" />
          </div>
          <h1 className="text-3xl font-serif text-teal-900 tracking-wider mb-1">PPKD HOTEL</h1>
          <h2 className="text-lg font-light text-slate-600">Formulir Pendaftaran / Registration</h2>
        </div>

        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-lg overflow-hidden border border-slate-200">
          <form onSubmit={handleSubmit}>

            {/* -- SECTION 1: TOP INFOS -- */}
            <div className="flex flex-col md:flex-row border-b border-slate-200 text-sm">
              <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50">
                <label className="block text-xs text-slate-500 mb-1">Room No.</label>
                <input type="text" name="roomNo" value={formData.roomNo} onChange={handleInputChange} className="w-full bg-transparent border-b border-slate-300 focus:border-teal-600 outline-none pb-1" placeholder="e.g. 0601" />
              </div>
              <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-slate-200">
                <label className="block text-xs text-slate-500 mb-1">Jumlah Tamu / No. of Person</label>
                <input type="number" min="1" name="noOfPerson" value={formData.noOfPerson} onChange={handleInputChange} className="w-full bg-transparent border-b border-slate-300 focus:border-teal-600 outline-none pb-1" />
              </div>
              <div className="flex-[2] p-4 flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">Jumlah Kamar / Room</label>
                  <input type="number" min="1" name="noOfRoom" value={formData.noOfRoom} onChange={handleInputChange} className="w-full bg-transparent border-b border-slate-300 focus:border-teal-600 outline-none pb-1" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">Jenis Kamar / Type</label>
                  <select name="roomType" value={formData.roomType} onChange={handleInputChange} className="w-full bg-transparent border-b border-slate-300 focus:border-teal-600 outline-none pb-1">
                    <option value="Standard Room">Standard (Rp 500k)</option>
                    <option value="Superior Room">Superior (Rp 750k)</option>
                    <option value="Deluxe Room">Deluxe (Rp 1Jt)</option>
                    <option value="Executive Suite">Suite (Rp 2.5Jt)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">Front Office</label>
                  <input type="text" name="receptionist" value={formData.receptionist} onChange={handleInputChange} className="w-full bg-transparent border-b border-slate-300 focus:border-teal-600 outline-none pb-1" />
                </div>
              </div>
            </div>

            <div className="bg-teal-50/50 text-center py-3 text-sm font-medium text-teal-800 border-b border-slate-200">
              Check Out Time : 12.00 Noon &nbsp; | &nbsp; Waktu Lapor Keluar : Jam 12.00 Siang
            </div>

            <div className="p-1 bg-slate-100/50 text-xs text-center text-slate-500 border-b border-slate-200 uppercase tracking-wider">
              Harap tulis dengan huruf cetak — Please print in block letters
            </div>

            {/* -- SECTION 2: GUEST DETAILS -- */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-200 text-sm">

              {/* Left Column blocks */}
              <div className="md:col-span-8 border-r border-slate-200">
                <div className="p-4 border-b border-slate-200">
                  <label className="block text-xs text-slate-500 mb-1">Nama / Name <span className="text-red-500">*</span></label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-transparent outline-none font-medium" placeholder="Full Name" />
                </div>

                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                  <label className="block text-xs text-slate-500 mb-1">Pekerjaan / Profession</label>
                  <input type="text" name="profession" value={formData.profession} onChange={handleInputChange} className="w-full bg-transparent outline-none" />
                </div>

                <div className="p-4 border-b border-slate-200">
                  <label className="block text-xs text-slate-500 mb-1">Perusahaan / Company</label>
                  <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-transparent outline-none" />
                </div>

                <div className="flex border-b border-slate-200 bg-slate-50/50">
                  <div className="flex-1 p-4 border-r border-slate-200">
                    <label className="block text-xs text-slate-500 mb-1">Kebangsaan / Nationality</label>
                    <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full bg-transparent outline-none" />
                  </div>
                  <div className="flex-1 p-4 border-r border-slate-200">
                    <label className="block text-xs text-slate-500 mb-1">No. KTP / Passport No.</label>
                    <input type="text" name="idNumber" value={formData.idNumber} onChange={handleInputChange} className="w-full bg-transparent outline-none" />
                  </div>
                  <div className="flex-1 p-4">
                    <label className="block text-xs text-slate-500 mb-1 text-red-700">Tanggal Lahir / Birth Date</label>
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full bg-transparent outline-none text-slate-700" />
                  </div>
                </div>

                <div className="flex border-b border-slate-200">
                  <div className="flex-1 p-4 border-r border-slate-200">
                    <label className="block text-xs text-slate-500 mb-1">Alamat / Address</label>
                    <textarea rows="3" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-transparent outline-none resize-none" placeholder="Full address"></textarea>
                  </div>
                  <div className="flex-1 p-4">
                    <label className="block text-xs text-slate-500 mb-1">Telephone / Phone / Mobile phone <span className="text-red-500">*</span></label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-transparent outline-none" placeholder="+62..." />
                  </div>
                </div>

                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                  <label className="block text-xs text-slate-500 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-transparent outline-none" />
                </div>

                <div className="p-4 bg-slate-50/50">
                  <label className="block text-xs text-slate-500 mb-1">No. Member / </label>
                  <input type="text" name="memberNo" value={formData.memberNo} onChange={handleInputChange} className="w-full bg-transparent outline-none" />
                </div>

              </div>

              {/* Right Column blocks (Dates) */}
              <div className="md:col-span-4 bg-slate-50/20">
                <div className="p-4 border-b border-slate-200 h-[105px]">
                  <label className="block text-xs text-slate-500 mb-1 group-focus-within:text-teal-600">Waktu Kedatangan<br />Arrival Time</label>
                  <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleInputChange} className="w-full bg-transparent outline-none mt-2" />
                </div>
                <div className="p-4 border-b border-slate-200 h-[105px]">
                  <label className="block text-xs text-slate-500 mb-1">Tanggal Kedatangan<br />Arrival Date <span className="text-red-500">*</span></label>
                  <input required type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleInputChange} className="w-full bg-transparent outline-none mt-2" />
                </div>
                <div className="p-4 border-b border-slate-200 h-[105px]">
                  <label className="block text-xs text-slate-500 mb-1 text-red-700 font-medium">Tgl Keberangkatan<br />Departure Date <span className="text-red-500">*</span></label>
                  <input required type="date" name="departureDate" value={formData.departureDate} onChange={handleInputChange} className="w-full bg-transparent outline-none mt-2" />
                </div>
                <div className="p-4 h-[200px]">
                  {/* Empty block matching the big blank space */}
                </div>
              </div>

            </div>

            {/* -- SECTION 3: BOTTOM DEPOSIT -- */}
            <div className="flex flex-col md:flex-row border-b border-slate-200 text-sm">
              <div className="flex-[2] p-4 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-100/50">
                <label className="block text-xs text-slate-500 mb-1">Nomor Kotak Deposit<br />Safety Deposit Box Number</label>
                <input type="text" name="safetyDepositBox" value={formData.safetyDepositBox} onChange={handleInputChange} className="w-full bg-transparent outline-none" />
              </div>
              <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-100/50">
                <label className="block text-xs text-slate-500 mb-1">Dikeluarkan oleh<br />Issued</label>
                <input type="text" name="issuedBy" value={formData.issuedBy} onChange={handleInputChange} className="w-full bg-transparent outline-none" />
              </div>
              <div className="flex-1 p-4 bg-slate-100/50">
                <label className="block text-xs text-slate-500 mb-1">Tanggal<br />Date</label>
                <input type="date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} className="w-full bg-transparent outline-none" />
              </div>
            </div>

            {/* Signatures placeholder */}
            <div className="flex flex-col md:flex-row justify-between p-12 px-16 gap-12 bg-white">
              <div className="flex-1">
                <div className="h-32 border-b-2 border-slate-200 relative group transition-all duration-300 hover:border-teal-400">
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-4xl font-serif">Signature</span>
                  </div>
                  {formData.name && (
                    <div className="absolute bottom-1 left-0 right-0 text-center">
                      <span className="text-lg font-script italic text-slate-800">{formData.name}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Guest Signature</p>
                  <p className="text-[10px] text-slate-400 mt-1 italic">Sign above this line</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-32 border-b-2 border-slate-200 relative group transition-all duration-300 hover:border-teal-400">
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-4xl font-serif">Front Office</span>
                  </div>
                  {formData.receptionist && (
                    <div className="absolute bottom-1 left-0 right-0 text-center">
                      <span className="text-lg font-script italic text-slate-800">{formData.receptionist}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Front Office Signature</p>
                  <p className="text-[10px] text-slate-400 mt-1 italic">Authorized personnel only</p>
                </div>
              </div>
            </div>

            {/* Form Actions & Total Estimasi */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-left w-full md:w-auto p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Estimasi Biaya</p>
                <p className="text-2xl font-bold text-teal-700">
                  {formatCurrency(
                    calculateNights(formData.arrivalDate, formData.departureDate)
                    * (ROOM_RATES[formData.roomType] || 0)
                    * (parseInt(formData.noOfRoom) || 1)
                  )}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">({formData.noOfRoom} Kamar × {calculateNights(formData.arrivalDate, formData.departureDate)} Malam)</p>
              </div>

              <button type="submit" className="px-10 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 w-full md:w-auto text-lg">
                Proses Registrasi & Cetak
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Registration;
