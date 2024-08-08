import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderById } from "../redux/actions/order";
import styles from "../styles/styles";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Invoice = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, isLoading } = useSelector((state) => state.order);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        Order not found
      </div>
    );
  }

  const calculateSubTotal = (price, quantity) => price * quantity;
  const calculateTotal = (
    subTotal,
    gstPercentage,
    couponDiscount,
    sellerDeliveryFees
  ) => {
    const gstAmount = subTotal * (gstPercentage / 100);
    let total = subTotal + gstAmount;
    if (couponDiscount) total -= couponDiscount;
    if (sellerDeliveryFees) total += sellerDeliveryFees;
    return total;
  };

  const subTotal = order.cart.reduce(
    (acc, item) => acc + calculateSubTotal(item.discountPrice, item.qty),
    0
  );
  const gstAmount = subTotal * (order.gstPercentage / 100);
  const totalPrice = calculateTotal(
    subTotal,
    order.gstPercentage,
    order.coupon?.couponDiscount,
    order.sellerDeliveryFees
  );

  // Function to download PDF
  const downloadPDF = () => {
    const capture = document.querySelector(".pdf");
    setLoading(true);

    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("Invoice.pdf");
      setLoading(false);
    });
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg pdf">
        <h2
          className="text-3xl font-bold mb-4 py-4 text-center"
          style={{ color: "#243450" }}
        >
          INVOICE
        </h2>

        <div className="mb-6 text-sm text-neutral-600">
          <p className="whitespace-nowrap">
            <strong>Order ID:</strong> {order._id}
          </p>
          <p className="whitespace-nowrap">
            <strong>Invoice Number:</strong> {order.invoiceId}
          </p>
          <p className="whitespace-nowrap">
            <strong>Order Date:</strong>
            {String(order.createdAt).substring(0, 10)}
          </p>
          <p className="whitespace-nowrap">
            <strong>Order Status:</strong> {order.status}
          </p>
        </div>

        <div className="bg-gray-100 px-14 py-6 text-sm text-neutral-600">
          <div className="flex justify-between">
            <div className="w-1/2">
              <p className="font-bold">Sender:</p>
              <p>Tshirt Galaxy</p>
              <p>3rd Main Road, VP Nagar</p>
              <p>Udupi, Karnataka, India</p>
              <p>PIN Code: 576102</p>
              <p>Phone: 8012345678</p>
              <p>Email: info@tshirtgalaxy.com</p>
            </div>
            <div className="w-1/2">
              <p className="font-bold">Recipient:</p>
              <p>{order.user.name}</p>
              <p>{`${order.shippingAddress.address1}, ${order.shippingAddress.address2}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`}</p>
              <p>PIN Code: {order.shippingAddress.zipCode}</p>
              <p>Phone: {order.user.phoneNumber}</p>
              <p>Email: {order.user.email}</p>
            </div>
          </div>
        </div>

        <div className="px-14 py-10 text-sm text-neutral-700">
          <table className="w-full border-collapse border-spacing-0">
            <thead>
              <tr>
                <th
                  className="border-b-2 border-[#243450] pb-3 pl-3 font-bold"
                  style={{ color: "#243450" }}
                >
                  #
                </th>
                <th
                  className="border-b-2 border-[#243450] pb-3 pl-2 font-bold"
                  style={{ color: "#243450" }}
                >
                  Product Details
                </th>
                <th
                  className="border-b-2 border-[#243450] pb-3 pl-2 text-right font-bold"
                  style={{ color: "#243450" }}
                >
                  Unit Price
                </th>
                <th
                  className="border-b-2 border-[#243450] pb-3 pl-2 text-center font-bold"
                  style={{ color: "#243450" }}
                >
                  Qty.
                </th>
                <th
                  className="border-b-2 border-[#243450] pb-3 pl-2 text-center font-bold"
                  style={{ color: "#243450" }}
                >
                  Size
                </th>
                <th
                  className="border-b-2 border-[#243450] pb-3 pl-2 pr-3 text-right font-bold"
                  style={{ color: "#243450" }}
                >
                  Sub Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.cart.map((item, index) => (
                <tr key={index}>
                  <td
                    className="border-b py-3 pl-3"
                    style={{ borderColor: "#243450" }}
                  >
                    {index + 1}.
                  </td>
                  <td
                    className="border-b py-3 pl-2"
                    style={{ borderColor: "#243450" }}
                  >
                    {item.name}
                  </td>
                  <td
                    className="border-b py-3 pl-2 text-right"
                    style={{ borderColor: "#243450" }}
                  >
                    ₹{item.discountPrice}
                  </td>
                  <td
                    className="border-b py-3 pl-2 text-center"
                    style={{ borderColor: "#243450" }}
                  >
                    {item.qty}
                  </td>
                  <td
                    className="border-b py-3 pl-2 text-center"
                    style={{ borderColor: "#243450" }}
                  >
                    {item.size}
                  </td>
                  <td
                    className="border-b py-3 pl-2 pr-3 text-right"
                    style={{ borderColor: "#243450" }}
                  >
                    ₹{calculateSubTotal(item.discountPrice, item.qty)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={6}>
                  <table className="w-full border-collapse border-spacing-0 mt-4">
                    <tbody>
                      <tr>
                        <td className="w-full"></td>
                        <td>
                          <table className="w-full border-collapse border-spacing-0">
                            <tbody>
                              <tr>
                                <td className="border-b p-3">
                                  <div className="whitespace-nowrap">
                                    GST ({order.gstPercentage}%):
                                  </div>
                                </td>
                                <td className="border-b p-3 text-right">
                                  <div className="whitespace-nowrap font-bold ">
                                    ₹{gstAmount.toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                              {order.coupon && (
                                <tr>
                                  <td className="border-b p-3">
                                    <div className="whitespace-nowrap ">
                                      Coupon Discount(
                                      {order.coupon.couponDiscountPercentage}%):
                                    </div>
                                  </td>
                                  <td className="border-b p-3 text-right">
                                    <div className="whitespace-nowrap font-bold ">
                                      ₹{order.coupon.couponDiscount.toFixed(2)}
                                    </div>
                                  </td>
                                </tr>
                              )}
                              {order.sellerDeliveryFees && (
                                <tr>
                                  <td className="border-b p-3">
                                    <div className="whitespace-nowrap ">
                                      Delivery Charge:
                                    </div>
                                  </td>
                                  <td className="border-b p-3 text-right">
                                    <div className="whitespace-nowrap font-bold ">
                                      ₹{order.sellerDeliveryFees.toFixed(2)}
                                    </div>
                                  </td>
                                </tr>
                              )}
                              <tr>
                                <td className={`bg-${styles.primaryColor} p-3`}>
                                  <div className="whitespace-nowrap font-bold text-white">
                                    Total:
                                  </div>
                                </td>
                                <td
                                  className={`bg-${styles.primaryColor} p-3 text-right`}
                                >
                                  <div className="whitespace-nowrap font-bold text-white">
                                    ₹{totalPrice.toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-sm text-neutral-700">
          <div className="flex justify-between">
            <div className="w-2/3">
              <p className="font-bold" style={{ color: "#243450" }}>
                Payment Details:
              </p>
              <p>Payment Status: {order.paymentInfo.status}</p>
              <p>Payment Type: {order.paymentInfo.type}</p>
              {order.paymentInfo.id && (
                <p>Payment ID: {order.paymentInfo.id}</p>
              )}
              <p>Amount Paid: ₹{totalPrice.toFixed(2)}</p>
              <p>Payment Date: {String(order.paidAt).substring(0, 10)}</p>
            </div>
            <div className="w-2/5">
              <p className="font-bold" style={{ color: "#243450" }}>
                Shop Details:
              </p>
              <p>Shop Name: {order.cart[0].shop.name}</p>
              <p>Email: {order.cart[0].shop.email}</p>
              <p>Phone Number: {order.cart[0].shop.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className="pt-10 text-sm text-neutral-700">
          <footer className="bottom-0 left-0 bg-gray-100 w-full text-neutral-600 text-center text-xs py-3">
            Tshirt Galaxy
            <span className="text-slate-300 px-2">|</span>
            info@tshirtgalaxy.com
            <span className="text-slate-300 px-2">|</span>
            +91 8012345678
          </footer>
        </div>
      </div>
      {/* Button to download PDF */}
      <div className="flex justify-center mb-3">
        <button
          className={`${styles.simpleButton} mt-4`}
          onClick={downloadPDF}
          disabled={loading}
        >
          {loading ? <span>Downloading</span> : <span>Download Invoice</span>}
        </button>
      </div>
    </>
  );
};

export default Invoice;
