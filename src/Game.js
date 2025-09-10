import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Game() {
  const [country, setCountry] = useState("");
  const [started, setStarted] = useState(false);

  // Level state
  const [level, setLevel] = useState(1);

  // Money and game states
  const [money, setMoney] = useState(1000);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState("You have $1000. What will you do?");
  const [gameOver, setGameOver] = useState(false);
  const [points, setPoints] = useState(0);
  const [startingMoney, setStartingMoney] = useState(1000);

  // Level 3 tracking
  const [businessInvestment, setBusinessInvestment] = useState(false);
  const [realEstate, setRealEstate] = useState(false);
  const [retirementContribution, setRetirementContribution] = useState(0);
  const [loanTaken, setLoanTaken] = useState(false);

  const startGame = () => {
    if (!country) {
      alert("Please select your country first!");
      return;
    }
    setLevel(1);
    setMoney(1000);
    setStartingMoney(1000);
    setRound(1);
    setMessage("You have $1000. What will you do?");
    setGameOver(false);
    setPoints(0);
    setBusinessInvestment(false);
    setRealEstate(false);
    setRetirementContribution(0);
    setLoanTaken(false);
    setStarted(true);
  };

  const getCountryAdvice = () => {
    if (country === "india") {
      return "💡 In India, consistent savings and cautious investments are key due to inflation.";
    } else if (country === "canada") {
      return "💡 In Canada, diversify between safe savings and moderate-risk investments.";
    } else if (country === "usa") {
      return "💡 In the USA, balance lifestyle spending with long-term investing and credit health.";
    }
    return "";
  };

  // 🌟 Level 3 random events
  const randomEvent = (currentMoney) => {
    const chance = Math.random();
    if (chance < 0.25) {
      // 25% event chance
      if (Math.random() > 0.5) {
        setMessage("🎁 Surprise bonus! +$200");
        return currentMoney + 200;
      } else {
        setMessage("💊 Unexpected medical bill! -$150");
        return currentMoney - 150;
      }
    }
    return currentMoney;
  };

  const play = (choice) => {
    let change = 0;
    let msg = "";
    const interestRate = 0.0016;

    if (level === 1) {
      if (choice === "eat_out") {
        change = -50;
        msg = "You enjoyed eating out! Money decreased by $50.";
      } else if (choice === "stay_in") {
        change = 50;
        msg = "You stayed in and saved $50. Nice discipline!";
      } else if (choice === "invest_stock") {
        change = Math.random() > 0.5 ? 200 : -200;
        msg = change > 0 ? "📈 Stock paid off +$200!" : "📉 Lost $200 in stock.";
      } else if (choice === "save_bank") {
        change = money * interestRate;
        msg = `🏦 Bank savings earned you $${change.toFixed(2)} interest.`;
      }
    } else if (level === 2) {
      if (choice === "eat_out") {
        change = -20;
        msg = "You ate out cheaply! -$20.";
      } else if (choice === "stay_in") {
        change = 20;
        msg = "You stayed in and saved $20.";
      } else if (choice === "stock_low") {
        change = Math.random() > 0.5 ? 10 : -10;
        msg = change > 0 ? "📈 Low-risk stock +$10!" : "📉 Low-risk stock -$10.";
      } else if (choice === "stock_medium") {
        change = Math.random() > 0.5 ? 100 : -100;
        msg =
          change > 0
            ? "📈 Medium-risk stock +$100!"
            : "📉 Medium-risk stock -$100.";
      } else if (choice === "save_bank") {
        change = money * interestRate;
        msg = `🏦 Bank savings earned you $${change.toFixed(2)} interest.`;
      }
    } else if (level === 3) {
      // Level 3 rules
      if (choice === "business") {
        if (!businessInvestment && money >= 500) {
          setBusinessInvestment(true);
          change = -500;
          msg = "🚀 You started a business (potential high reward at end)!";
        } else {
          msg = "You already invested in a business or insufficient funds.";
        }
      } else if (choice === "real_estate") {
        if (!realEstate && money >= 300) {
          setRealEstate(true);
          change = -300;
          msg = "🏠 You bought real estate (+$50 each round)!";
        } else {
          msg = "You already own real estate or insufficient funds.";
        }
      } else if (choice === "retirement") {
        if (money >= 100) {
          setRetirementContribution(retirementContribution + 100);
          change = -100;
          msg = "💼 Contributed $100 to retirement fund (+$600 at end).";
        } else {
          msg = "Not enough money to contribute.";
        }
      } else if (choice === "loan") {
        if (!loanTaken) {
          setLoanTaken(true);
          change = +200;
          msg = "💳 You took a loan +$200 (must repay $250 at end).";
        } else {
          msg = "You already took a loan this level.";
        }
      }
      // Passive income from real estate
      if (realEstate) {
        change += 50;
        msg += " 🏠 Real estate generated +$50 this round.";
      }
      // Random events
      let newMoney = money + change;
      newMoney = randomEvent(newMoney);
      setMoney(newMoney);
      setMessage(msg);
      // Round tracking
      if (round === 5) {
        endLevel3(newMoney);
      } else {
        setRound(round + 1);
      }
      return; // exit early to avoid double apply
    }

    // For Levels 1 & 2
    const newMoney = money + change;
    setMoney(newMoney);
    setMessage(msg);

    if (round === 5) {
      setGameOver(true);
      setPoints(newMoney - startingMoney);
    } else {
      setRound(round + 1);
    }
  };

  const endLevel3 = (finalMoney) => {
    // Add retirement fund bonus
    let total = finalMoney + (retirementContribution > 0 ? 600 : 0);
    // Business profit/loss
    if (businessInvestment) {
      total += Math.random() > 0.5 ? 1000 : -300;
    }
    // Loan repayment
    if (loanTaken) {
      total -= 250;
    }
    setMoney(total);
    setGameOver(true);
    setPoints(total - startingMoney);
  };

  const startLevel2 = () => {
    setLevel(2);
    setStartingMoney(money);
    setRound(1);
    setMessage(`Welcome to Level 2 – You have $${money.toFixed(2)}. Choose wisely!`);
    setGameOver(false);
    setPoints(0);
  };

  const startLevel3 = () => {
    setLevel(3);
    setStartingMoney(money);
    setRound(1);
    setMessage(`🏆 Welcome to Level 3 – Big decisions ahead. You have $${money.toFixed(2)}.`);
    setGameOver(false);
    setPoints(0);
    setBusinessInvestment(false);
    setRealEstate(false);
    setRetirementContribution(0);
    setLoanTaken(false);
  };

  const resetGame = () => {
    setCountry("");
    setStarted(false);
    setLevel(1);
    setMoney(1000);
    setStartingMoney(1000);
    setRound(1);
    setMessage("You have $1000. What will you do?");
    setGameOver(false);
    setPoints(0);
    setBusinessInvestment(false);
    setRealEstate(false);
    setRetirementContribution(0);
    setLoanTaken(false);
  };

  return (
    <div className="game">
      <h1>💰 Real-Life Money Maze</h1>
      <h2>Level {level}</h2>

      {!started ? (
        <div>
          <h2>Select Your Country</h2>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">--Choose--</option>
            <option value="india">🇮🇳 India</option>
            <option value="canada">🇨🇦 Canada</option>
            <option value="usa">🇺🇸 USA</option>
          </select>
          <br />
          <br />
          <button onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <>
          <p>Round {round}/5</p>
          <p>Balance: ${money.toFixed(2)}</p>
          <p>{message}</p>

          {!gameOver ? (
            <div>
              {level === 1 && (
                <>
                  <button onClick={() => play("eat_out")}>🍔 Eat Out (-$50)</button>
                  <button onClick={() => play("stay_in")}>🏠 Stay In (+$50)</button>
                  <button onClick={() => play("invest_stock")}>
                    📈 Invest in Stock (+/- $200)
                  </button>
                  <button onClick={() => play("save_bank")}>
                    🏦 Save in Bank (+interest)
                  </button>
                </>
              )}
              {level === 2 && (
                <>
                  <button onClick={() => play("eat_out")}>🍔 Eat Out (-$20)</button>
                  <button onClick={() => play("stay_in")}>🏠 Stay In (+$20)</button>
                  <button onClick={() => play("stock_low")}>
                    📉 Low Risk Stock (+/- $10)
                  </button>
                  <button onClick={() => play("stock_medium")}>
                    📈 Medium Risk Stock (+/- $100)
                  </button>
                  <button onClick={() => play("save_bank")}>
                    🏦 Save in Bank (+interest)
                  </button>
                </>
              )}
              {level === 3 && (
                <>
                  <button onClick={() => play("business")}>🚀 Start Business (-$500)</button>
                  <button onClick={() => play("real_estate")}>
                    🏠 Buy Real Estate (-$300 +$50/round)
                  </button>
                  <button onClick={() => play("retirement")}>
                    💼 Retirement Fund (-$100 each round)
                  </button>
                  <button onClick={() => play("loan")}>
                    💳 Take Loan (+$200 repay $250 at end)
                  </button>
                </>
              )}
            </div>
          ) : (
            <div>
              {level === 1 && (
                <>
                  <h2>🎉 Level 1 Complete</h2>
                  <p>Balance after Level 1: ${money.toFixed(2)}</p>
                  <p>Score: {points >= 0 ? `+${points.toFixed(2)}` : points.toFixed(2)} points</p>
                  <p>{getCountryAdvice()}</p>
                  <button onClick={startLevel2}>➡️ Go to Level 2</button>
                </>
              )}
              {level === 2 && (
                <>
                  <h2>🎉 Level 2 Complete</h2>
                  <p>Balance after Level 2: ${money.toFixed(2)}</p>
                  <p>Score: {points >= 0 ? `+${points.toFixed(2)}` : points.toFixed(2)} points</p>
                  <p>{getCountryAdvice()}</p>
                  <button onClick={startLevel3}>🏆 Go to Level 3</button>
                </>
              )}
              {level === 3 && (
                <>
                  <h2>🎉 Game Over – Level 3 Complete</h2>
                  <p>Final Balance: ${money.toFixed(2)}</p>
                  <p>Score: {points >= 0 ? `+${points.toFixed(2)}` : points.toFixed(2)} points</p>
                  <p>
                    {money >= startingMoney + 500
                      ? "🌟 Excellent planning! You achieved financial freedom."
                      : money >= startingMoney * 0.8
                      ? "👍 Decent planning, but room to improve."
                      : "⚠️ Be careful! You lost too much money."}
                  </p>
                  <p>{getCountryAdvice()}</p>
                  <Link to="/"><button>🔙 Back to Benefit Buddy</button></Link>
                  <button onClick={resetGame}>🔄 Play Again</button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
