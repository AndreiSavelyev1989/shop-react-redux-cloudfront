const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatAsPrice = (price: number) => priceFormatter.format(price);

export const getAuthorizationHeader = (): { Authorization?: string } => {
  const userName = localStorage.getItem("user_name");
  const password = localStorage.getItem("password");

  if (!userName || !password) return {};

  const token = btoa(`${userName}:${password}`);

  return { Authorization: `Basic ${token}` };
};

export const getResultMessage = (statusCode: number, message: string) =>
  alert(`Status code: ${statusCode} \n${message}`);
