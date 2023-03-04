import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import { ProgressBar } from "react-loader-spinner";
import Withdraw from "../assets/Withdraw.svg";
import Web3 from "web3";

const Form = () => {
  const [wallet, setWallet] = useState("");
  const [network, setNetwork] = useState("");
  const [walletError, setWalletError] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [subTextStatus, setSubTextStatus] = useState<
    "notRequested" | "recieved" | "alreadyRecieved"
  >("notRequested");

  const withdraw = useMutation<
    any,
    any,
    {
      network: string;
      address: string;
    },
    any
  >((payload) => {
    // return instance.put("/", payload);
    // return axios.post("http://127.0.0.1:8000/", payload);
    return axios.post(
      "https://api.meowmeowdrip.com/",
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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

  const subText = () => {
    switch (subTextStatus) {
      case "notRequested":
        return (
          <div className="text-yellow-400 pt-5">
            Up to 1 testnet ETH per 24h
          </div>
        );
      case "recieved":
        return (
          <div className="text-green-400 pt-5">
            {network.charAt(0).toUpperCase() + network.slice(1)} ETH Sent!
          </div>
        );
      case "alreadyRecieved":
        return (
          <div className="text-red-400 pt-5">
            This wallet has already recieved{" "}
            {network.charAt(0).toUpperCase() + network.slice(1)} tokens. Please
            try again tommorow!
          </div>
        );
      default:
        return <></>;
    }
  };

  useEffect(() => {
    if (withdraw.status === "success") {
      // notify();
      setWallet("");
      const status = withdraw.data.data.status;
      if (status === 0) {
        setSubTextStatus("alreadyRecieved");
      } else {
        setSubTextStatus("recieved");
      }
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
      {subText()}
    </React.Fragment>
  );
};

export default Form;
