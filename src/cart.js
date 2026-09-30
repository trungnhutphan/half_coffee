export function addItem(cart, product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (!existingItem) {
    return [...cart, { ...product, quantity: 1 }];
  }

  return cart.map((item) => (
    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
  ));
}

export function changeQuantity(cart, productId, delta) {
  return cart.flatMap((item) => {
    if (item.id !== productId) {
      return [item];
    }

    const quantity = item.quantity + delta;
    return quantity > 0 ? [{ ...item, quantity }] : [];
  });
}

export function removeItem(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

export function getCartSummary(cart) {
  return cart.reduce(
    (summary, item) => ({
      itemCount: summary.itemCount + item.quantity,
      subtotal: summary.subtotal + (item.price * item.quantity),
    }),
    { itemCount: 0, subtotal: 0 },
  );
}
