import {useRef, useState} from 'react'
import Calculator from "./components/Calculator.tsx";

const DECIMAL_SEPARATOR = ".";

function SpeedRunCalculator() {
  const [isClear, setClear] = useState(true)
  const [displayValue, setDisplayValue] = useState("0")
  const operator = useRef<((rhs: number, lhs: number) => number) | null>(null)
  const resultCache = useRef<number | null>(null)
  const hasDecimalSeparator = displayValue.includes(DECIMAL_SEPARATOR)
  const isNegative = displayValue.startsWith("-");

  const allClear = () => {
      setClear(true);
      setDisplayValue("0");
      resultCache.current = null;
  }

    const toggleSign = () => {
        setDisplayValue(isNegative ? displayValue.substring(1) : `-${displayValue}`)
    }

  const shiftDecimalPoint = () => {
      const displayNumber = parseFloat(displayValue)
      let targetFractionDigits = 2
      if (hasDecimalSeparator) {
          targetFractionDigits = displayValue.split(DECIMAL_SEPARATOR)[1].length + 2
      }

      setDisplayValue((displayNumber / 100).toFixed(targetFractionDigits))
  }

  const binaryOperatorInput = (op: ((rhs: number, lhs: number) => number)) => {
      return () => {
          setClear(true)
          const result = equals()
          if (result) {
              resultCache.current = result;
          } else {
              resultCache.current = parseFloat(displayValue);
          }

          operator.current = op
      }
  }

  const decimalSeparatorInput = () => {
      if (hasDecimalSeparator) return

      setDisplayValue(`${displayValue}${DECIMAL_SEPARATOR}`)
  }

  const numberInput = (num: number) => {
      return () => {
          if (isClear) {
              setDisplayValue(`${num}`)
          } else {
              setDisplayValue(`${displayValue}${num}`)
          }

          setClear(false)
      }
  }

  const equals = () => {
      if (!resultCache) return

      if (!operator.current) return

      const result = operator.current(resultCache.current!, parseFloat(displayValue));
      setDisplayValue(`${result}`);
      operator.current = null
      return result;
  }

    const buttons = [
        {label: "AC", action: allClear },
        { label: "+/-", action: toggleSign },
        { label: "%", action: shiftDecimalPoint },
        { label: "/", action: binaryOperatorInput((rhs, lhs) => rhs / lhs) },
        { label: "7", action: numberInput(7) },
        { label: "8", action: numberInput(8) },
        { label: "9", action: numberInput(9) },
        { label: "x", action: binaryOperatorInput((rhs, lhs) => rhs * lhs) },
        { label: "4", action: numberInput(4) },
        { label: "5", action: numberInput(5) },
        { label: "6", action: numberInput(6) },
        { label: "-", action: binaryOperatorInput((rhs, lhs) => rhs - lhs) },
        { label: "1", action: numberInput(1) },
        { label: "2", action: numberInput(2) },
        { label: "3", action: numberInput(3) },
        { label: "+", action: binaryOperatorInput((rhs, lhs) => rhs + lhs) },
        { label: "0", action: numberInput(0) },
        { label: ",", action: decimalSeparatorInput },
        { label: "=", action: equals },
    ];

  return (
    <Calculator displayValue={displayValue} buttons={buttons} />
  )
}

export default SpeedRunCalculator
