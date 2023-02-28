import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import { ProgressBar } from "react-loader-spinner";
import { Store } from "react-notifications-component";
import Withdraw from "../assets/Withdraw.svg";
import Web3 from "web3";

const Form = () => {
  const [wallet, setWallet] = useState("");
  const [network, setNetwork] = useState("");
  const [walletError, setWalletError] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const notify = () => {
    Store.addNotification({
      title: "Drip Drip Drip",
      message: `${
        network.charAt(0).toUpperCase() + network.slice(1)
      } ETH Sent!`,
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
  };

  const withdraw = useMutation<
    void,
    void,
    {
      network: string;
      address: string;
    },
    void
  >((payload) => {
    return axios.post("/", payload);
  });

  const handleSubmit = () => {
    const isValid = Web3.utils.isAddress(wallet);
    let validInput = true;
    if (!isValid) {
      setWalletError(true);
      validInput = false;
    }

    if (network !== "sepolia" && network !== "goerli") {
      setNetworkError(true);
      validInput = false;
    }

    if (!validInput) {
      return;
    }

    withdraw.mutate({
      network: network,
      address: wallet,
    });

    setNetworkError(false);
    setWalletError(false);
  };

  useEffect(() => {
    if (withdraw.status === "success") {
      notify();
      setWallet("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdraw.status]);

  return (
    <React.Fragment>
      <div>
        <div
          style={{
            backgroundColor: "#212529",
            padding: "1rem 1.2rem 1rem 1rem",
            // width: "calc(100% + 8px)",
          }}
        >
          {networkError ? (
            <div className="nes-select is-error">
              <select
                required
                id="error_select"
                onChange={(e) => setNetwork(e.target.value)}
              >
                <option value="" disabled selected hidden>
                  Select Network...
                </option>
                <option value="sepolia">Sepolia</option>
                <option value="goerli">Goerli</option>
              </select>
            </div>
          ) : (
            <div className="nes-select is-dark">
              <select
                style={{ textAlign: "center" }}
                required
                id="dark_select"
                onChange={(e) => setNetwork(e.target.value)}
              >
                <option value="" disabled selected hidden>
                  Select Network...
                </option>
                <option value="sepolia">Sepolia</option>
                <option value="goerli">Goerli</option>
              </select>
            </div>
          )}
        </div>

        <div className="nes-field py-3">
          <div
            style={{ backgroundColor: "#212529", padding: "1rem" }}
            className="nes-field is-inline"
          >
            {walletError ? (
              <div className="nes-field is-inline">
                <input
                  type="text"
                  id="error_field"
                  className="nes-input is-error"
                  placeholder="Invalid Wallet Address"
                  style={{ textAlign: "center" }}
                  onChange={(e) => setWallet(e.target.value)}
                />
              </div>
            ) : (
              <input
                type="text"
                id="dark_field"
                className="nes-input is-dark"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="Wallet Address"
                style={{ textAlign: "center" }}
              />
            )}
          </div>
        </div>
      </div>
      <div>
        {withdraw.isLoading ? (
          <ProgressBar
            height="80"
            width="80"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass="progress-bar-wrapper"
            borderColor="#F4442E"
            barColor="#51E5FF"
          />
        ) : (
          <img
            src={Withdraw}
            alt="withdraw"
            className="nes-pointer"
            onClick={handleSubmit}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default Form;
