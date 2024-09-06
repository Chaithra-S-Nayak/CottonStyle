import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/user";
import { AiOutlineDelete } from "react-icons/ai";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: null,
    bankAccountNumber: null,
    bankHolderName: "",
    bankAddress: "",
  });

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const withdrawMethod = {
      bankName: bankInfo.bankName,
      bankCountry: bankInfo.bankCountry,
      bankSwiftCode: bankInfo.bankSwiftCode,
      bankAccountNumber: bankInfo.bankAccountNumber,
      bankHolderName: bankInfo.bankHolderName,
      bankAddress: bankInfo.bankAddress,
    };
    setPaymentMethod(false);
    await axios
      .post(
        `${server}/shop/add-payment-methods`,
        {
          withdrawMethod,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw method added successfully!");
        dispatch(loadSeller());
        setBankInfo({
          bankName: "",
          bankCountry: "",
          bankSwiftCode: null,
          bankAccountNumber: null,
          bankHolderName: "",
          bankAddress: "",
        });
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Withdraw method deleted successfully!");
        dispatch(loadSeller());
      });
  };

  const error = () => {
    toast.error("You not have enough balance to withdraw!");
  };

  const withdrawHandler = async () => {
    const availableBalanceNum = parseFloat(availableBalance);
    const amount = parseFloat(withdrawAmount);
    if (amount < 500 || amount > availableBalanceNum) {
      toast.error("You can't withdraw this amount!");
    } else {
      await axios
        .post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        )
        .then((res) => {
          window.location.reload();
          toast.success("Withdraw money request is successful!");
        });
    }
  };

  const availableBalance = seller?.availableBalance.toFixed(2);

  return (
    <div className="w-full h-[90vh] p-8">
      <div className="w-full h-full rounded flex items-center justify-center flex-col bg-white p-6 shadow-md">
        <div className="flex items-center justify-center flex-col">
          <h5 className="text-[22px] font-semibold text-gray-800 mb-4">
            Available Balance
          </h5>
          <div className="flex items-center text-[18px] text-green-600 font-medium mb-6">
            <span className="text-[28px] mr-2">₹</span>
            <span>{availableBalance}</span>
          </div>
          <button
            className={`${styles.simpleButton}`}
            onClick={() => (availableBalance < 50 ? error() : setOpen(true))}
          >
            Withdraw
          </button>

          <p className="text-red-500 text-center text-[14px] mt-4">
            Minimum balance of ₹50 required to withdraw.
          </p>
        </div>
      </div>

      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-[#0000004e]">
          <div
            className={`w-[95%] 800px:w-[30%] bg-white shadow rounded ${
              paymentMethod ? "h-[80vh] overflow-y-scroll" : "h-[unset]"
            } min-h-[30vh] p-3`}
          >
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                onClick={() => setOpen(false) || setPaymentMethod(false)}
                className="cursor-pointer"
              />
            </div>
            {paymentMethod ? (
              <div>
                <h1 className={`${styles.formHeading}`}>
                  Add new Withdraw Method:
                </h1>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label className={`${styles.formLabel}`}>
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name=""
                      required
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                      id=""
                      placeholder="Enter your Bank name"
                      className={`${styles.formInput}`}
                    />
                  </div>
                  <div className="pt-2">
                    <label className={`${styles.formLabel}`}>
                      Bank Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name=""
                      value={bankInfo.bankCountry}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankCountry: e.target.value,
                        })
                      }
                      id=""
                      required
                      placeholder="Enter your bank Country"
                      className={`${styles.formInput}`}
                    />
                  </div>
                  <div className="pt-2">
                    <label className={`${styles.formLabel}`}>
                      Bank Swift Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name=""
                      id=""
                      required
                      value={bankInfo.bankSwiftCode}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankSwiftCode: e.target.value,
                        })
                      }
                      placeholder="Enter your Bank Swift Code"
                      className={`${styles.formInput}`}
                    />
                  </div>

                  <div className="pt-2">
                    <label className={`${styles.formLabel}`}>
                      Bank Account Number
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name=""
                      id=""
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank account number"
                      className={`${styles.formInput}`}
                    />
                  </div>
                  <div className="pt-2">
                    <label className={`${styles.formLabel}`}>
                      Bank Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name=""
                      required
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                      id=""
                      placeholder="Enter your bank Holder name"
                      className={`${styles.formInput}`}
                    />
                  </div>
                  <div className="pt-2">
                    <label className={`${styles.formLabel}`}>
                      Bank Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      type="text"
                      name=""
                      required
                      id=""
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                      placeholder="Enter your bank address"
                      className={`${styles.formInput}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`${styles.simpleButton} mt-4`}
                  >
                    Add
                  </button>
                </form>
              </div>
            ) : (
              <>
                <h1 className={`${styles.formHeading}`}>
                  Available Withdraw Methods:
                </h1>

                {seller && seller?.withdrawMethod ? (
                  <div>
                    <div className="800px:flex w-full justify-between items-center">
                      <div className="800px:w-[50%]">
                        <h5>
                          Account Number:
                          {seller?.withdrawMethod.bankAccountNumber.length > 3
                            ? "*".repeat(
                                seller?.withdrawMethod.bankAccountNumber
                                  .length - 3
                              ) +
                              seller?.withdrawMethod.bankAccountNumber.slice(-3)
                            : seller?.withdrawMethod.bankAccountNumber}
                        </h5>
                        <h5>Bank Name: {seller?.withdrawMethod.bankName}</h5>
                      </div>
                      <div className="800px:w-[50%]">
                        <AiOutlineDelete
                          size={20}
                          className="cursor-pointer"
                          onClick={() => deleteHandler()}
                        />
                      </div>
                    </div>
                    <br />
                    <h4>Available Balance: ₹{availableBalance}</h4>
                    <br />
                    <div className="800px:flex w-full items-center">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className={`${styles.formInput}`}
                      />
                      <button
                        className={`${styles.simpleButton} md:ml-4 md:mt-0 mt-4`}
                        onClick={withdrawHandler}
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full p-6 rounded flex flex-col items-center">
                    <p className="text-[18px] font-medium text-gray-700 mb-4">
                      No Withdraw Methods Available
                    </p>
                    <p className="text-[16px] text-gray-600 mb-6 text-center">
                      You haven't added any withdraw methods yet. To withdraw
                      funds, please add a new payment method.
                    </p>
                    <button
                      className={`${styles.simpleButton}`}
                      onClick={() => setPaymentMethod(true)}
                    >
                      Add New Method
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
