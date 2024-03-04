import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Head from "next/head";

import styles from "../styles/ColorPicker.module.css";

function LabeledSlider({ label, value, setValue }) {
  return (
    <div>
      <span className={styles.colorLabel}>{label}:</span>
      <input
        data-testid={`${label}_range`}
        type="range"
        min="0"
        max="255"
        value={value}
        onChange={(event) => setValue(parseInt(event.target.value, 10))}
      />
      <input
        type="number"
        min="0"
        max="255"
        value={value}
        onChange={(event) => setValue(parseInt(event.target.value, 10))}
      />
    </div>
  );
}

LabeledSlider.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default function ColorPicker() {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);


  const color = {
    background: `rgb(${red}, ${green}, ${blue})`,
  };


  return (
    <>
      <Head>
        <title>Color Picker</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <div
            className={styles.colorSwatch}
            style={color}
            data-testid="swatch"
          />
          <LabeledSlider label="Red" value={red} setValue={setRed} />
          <LabeledSlider label="Green" value={green} setValue={setGreen} />
          <LabeledSlider label="Blue" value={blue} setValue={setBlue} />
        </div>
      </main>
    </>
  );
}
