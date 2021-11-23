export const emailValidator = (email) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return "Email cannot be empty.";
  if (!re.test(email)) return "Ooops! We need a valid email address.";

  return "";
};

export const passwordValidator = (password) => {
  if (!password || password.length <= 0) return "Password cannot be empty.";
  if (password.length <= 6) return "Password must be at least 6 characters";

  return "";
};

export const nameValidator = (name) => {
  if (!name || name.length <= 0) return "Name cannot be empty.";

  return "";
};

export const phoneValidator = (phone) => {
  const pattern1 = /^0\d{10}$/;
  const pattern2 = /^\+234\d{10}$/;
  if (!phone || phone.length <= 0) return "Phone cannot be empty.";
  if (
    !(
      pattern1.test(phone.toString().replace(/\s/g, "")) ||
      pattern2.test(phone.toString().replace(/\s/g, ""))
    )
  )
    return "Invalid phone format.";
  return "";
};

export const birthValidator = (dob) => {
  if (!dob) return "Date of birth cannot be empty.";
  const age_dt = new Date() - new Date(dob);
  const age = new Date(age_dt).getFullYear() - 1970;
  if (age < 6 || age > 120) return "Invalid date of birth";
  return "";
};

export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const groupByDay = (data) => {
  const res = [0, 1, 2, 3, 4, 5, 6].map((day) => {
    const dayDetails = data.filter((datum) => datum._id.day === day);
    const cancelled = dayDetails.find(
      (datum) => datum._id.status === "Cancelled"
    ) || { revenue: 0, total: 0 };
    const sales = dayDetails.find(
      (datum) => datum._id.status === "Delivered"
    ) || { revenue: 0, total: 0 };
    return [
      { date: days[day], sales: sales.total, cancelled: cancelled.total },
      { date: days[day], sales: sales.revenue, cancelled: cancelled.revenue },
    ];
  });
  return res.filter(
    (data) =>
      data[0].sales !== 0 ||
      data[0].cancelled !== 0 ||
      data[1].sales !== 0 ||
      data[1].cancelled !== 0
  );
};

export const groupByMonth = (data) => {
  const res = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
    const monthDetails = data.filter((datum) => datum._id.month === month);
    const cancelled = monthDetails.find(
      (datum) => datum._id.status === "Cancelled"
    ) || { revenue: 0, total: 0 };
    const sales = monthDetails.find(
      (datum) => datum._id.status === "Delivered"
    ) || { revenue: 0, total: 0 };
    return [
      {
        date: months[month - 1],
        sales: sales.total,
        cancelled: cancelled.total,
      },
      {
        date: months[month - 1],
        sales: sales.revenue,
        cancelled: cancelled.revenue,
      },
    ];
  });
  return res.filter(
    (data) =>
      data[0].sales !== 0 ||
      data[0].cancelled !== 0 ||
      data[1].sales !== 0 ||
      data[1].cancelled !== 0
  );
};
