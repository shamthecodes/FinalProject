// Call our Arcjet server before sensitive actions
const ARCJET_SERVER = "http://localhost:3001";

export const checkPaymentAllowed = async () => {
  try {
    const res = await fetch(`${ARCJET_SERVER}/api/payment/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return { allowed: true };
  } catch (err) {
    return { allowed: false, error: err.message };
  }
};

export const checkAiAllowed = async () => {
  try {
    const res = await fetch(`${ARCJET_SERVER}/api/ai/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return { allowed: true };
  } catch (err) {
    return { allowed: false, error: err.message };
  }
};

export const checkLoginAllowed = async () => {
  try {
    const res = await fetch(`${ARCJET_SERVER}/api/auth/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return { allowed: true };
  } catch (err) {
    return { allowed: false, error: err.message };
  }
};
