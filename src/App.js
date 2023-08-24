import logo from "./logo.svg";
import "./App.scss";
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import SoundWave from "./sound-wave";
import classNames from "classnames";

// Color pallette https://www.freepik.com/free-vector/flower-collection_4070755.htm#from_view=detail_alsolike

function buildVocabSet() {
	return [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];
}

function useVocabSet() {
	const [vocabSet, setVocabSet] = useState(buildVocabSet());
	const [vocabIndex, setVocabIndex] = useState(0);

	const getCurrentVocab = () => vocabSet[vocabIndex];
	const createSpellVocab = (vocab) => {
		return vocab.replace(/(.)/g, "$1, ") + vocab;
	};
	const createRepeatedVocab = (vocab) => {
		return `${vocab}, , ${vocab}`;
	};

	return {
		vocabIndex,
		currentVocab: getCurrentVocab(),
		repeatedVocab: () => createRepeatedVocab(getCurrentVocab()),
		spellVocab: () => createSpellVocab(getCurrentVocab()),
		nextVocab: () => {
			if (vocabSet.length && vocabSet.length - 1 > vocabIndex) {
				setVocabIndex(vocabIndex + 1);
				return vocabSet[vocabIndex + 1];
			}
		},
		previousVocab: () => {
			if (vocabSet.length && vocabIndex > 0) {
				setVocabIndex(vocabIndex - 1);
				return vocabSet[vocabIndex - 1];
			}
		},
	};
}

function useTts() {
	const speaker = new SpeechSynthesisUtterance();

	let preferredVoices = {
		// Windows
		"Microsoft Zira - English (United States)": {
			volume: parseFloat(1), // 0.0 - 1.0
			rate: parseFloat(0.5), // 0.1 - 10.0
			pitch: parseFloat(1), // 0.0 - 2.0
		},
		// Android
		"English United States": {
			volume: parseFloat(1), // 0.0 - 1.0
			rate: parseFloat(0.35), // 0.1 - 10.0
			pitch: parseFloat(1), // 0.0 - 2.0
		},
		// iOS
		Karen: {
			volume: parseFloat(1), // 0.0 - 1.0
			rate: parseFloat(0.7), // 0.1 - 10.0
			pitch: parseFloat(1), // 0.0 - 2.0
		},
	};

	speaker.voice = speechSynthesis.getVoices().filter(function (voice) {
		const isCorrect = !!preferredVoices[voice.name];

		if (isCorrect) {
			// Set the attributes.
			speaker.rate = preferredVoices[voice.name].rate;
			speaker.volume = preferredVoices[voice.name].volume;
			speaker.pitch = preferredVoices[voice.name].pitch;
		}

		return isCorrect;
	})[0];

	const [tts, setTts] = useState(speaker);

	return {
		speak: (text, onEnd = null) => {
			// Create a new instance of SpeechSynthesisUtterance.
			// var msg = new SpeechSynthesisUtterance();
			// msg.voice = speechSynthesis.getVoices().filter(function (voice) {
			// 	const isCorrect = voice.name == "English United States";

			// 	return isCorrect;
			// })[0];
			// msg.rate = 0.1;

			var msg = tts;

			// Set the text.
			msg.text = text ?? "Test test";
			// msg.text = tts.voice?.name;

			if (onEnd && typeof onEnd === "function") {
				msg.addEventListener("end", (event) => {
					console.log(
						`Utterance has finished being spoken after ${event.elapsedTime} seconds.`
					);
					onEnd();
				});
			}

			// Queue this utterance.
			window.speechSynthesis.speak(msg);
		},
	};
}

const ButtonBody = styled.div`
	border-radius: 100%;
	width: 120px;
	height: auto;
	aspect-ratio: 1;
	background: #000;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

	svg {
		fill: white;
		width: 40%;
	}

	&.play-button,
	&.spell-button {
		width: clamp(3rem, 5.357rem + 2.381vw, 7.5rem);
	}

	&.play-button {
		background: #fb787e;
	}

	&.spell-button {
		background: #cc9fca;
		color: white;
		user-select: none;
	}

	&.next-button,
	&.previous-button {
		background: #62929c;
		width: 80px;
	}
`;

const PlayButton = (props) => {
	return (
		<ButtonBody className="play-button" {...props}>
			<svg version="1.1" viewBox="0 0 32 32">
				<path d="M28,16c-1.219,0-1.797,0.859-2,1.766C25.269,21.03,22.167,26,16,26c-5.523,0-10-4.478-10-10S10.477,6,16,6  c2.24,0,4.295,0.753,5.96,2H20c-1.104,0-2,0.896-2,2s0.896,2,2,2h6c1.104,0,2-0.896,2-2V4c0-1.104-0.896-2-2-2s-2,0.896-2,2v0.518  C21.733,2.932,18.977,2,16,2C8.268,2,2,8.268,2,16s6.268,14,14,14c9.979,0,14-9.5,14-11.875C30,16.672,28.938,16,28,16z" />
			</svg>
		</ButtonBody>
	);
};

const SpellButton = (props) => {
	return (
		<ButtonBody className="spell-button" {...props}>
			abc
		</ButtonBody>
	);
};

const NextButton = (props) => {
	return (
		<ButtonBody className="next-button" {...props}>
			<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
				<title />
				<path d="M400,64a16,16,0,0,0-16,16V216.43L151.23,77.11a35.13,35.13,0,0,0-35.77-.44C103.46,83.47,96,96.63,96,111V401c0,14.37,7.46,27.53,19.46,34.33a35.14,35.14,0,0,0,35.77-.45L384,295.57V432a16,16,0,0,0,32,0V80A16,16,0,0,0,400,64Z" />
			</svg>
		</ButtonBody>
	);
};

const PreviousButton = (props) => {
	return (
		<ButtonBody className="previous-button" {...props}>
			<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
				<title />
				<path d="M112,64a16,16,0,0,1,16,16V216.43L360.77,77.11a35.13,35.13,0,0,1,35.77-.44c12,6.8,19.46,20,19.46,34.33V401c0,14.37-7.46,27.53-19.46,34.33a35.14,35.14,0,0,1-35.77-.45L128,295.57V432a16,16,0,0,1-32,0V80A16,16,0,0,1,112,64Z" />
			</svg>
		</ButtonBody>
	);
};

const PracticeNav = styled.div`
	display: flex;
	flex-flow: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	max-width: 1150px;
	margin: auto;
	padding: 0 5%;
	gap: 8%;
`;

const Counter = styled.div`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	line-height: 1;

	width: 2em;
	height: auto;
	aspect-ratio: 1;
	border-radius: 100%;

	background: #fffff5;
	color: #b47f87;
`;

const Logo = styled.div`
	font-size: 30px;
	font-weight: 900;
	letter-spacing: -0.07em;
	text-shadow: 0px 0px 0.5em rgba(0, 0, 0, 0.04);
`;

const VocabSetInfo = styled.div`
	font-size: 16px;
	font-weight: 600;

	padding: 0.5em 1em;
	border-radius: 8px;
	background: rgba(255,255,255,0.2);
`;

function App() {
	const {
		vocabIndex,
		currentVocab,
		repeatedVocab,
		spellVocab,
		nextVocab,
		previousVocab,
	} = useVocabSet();
	const { speak } = useTts();
	const [isPlaying, setPlaying] = useState(false);
	const [pendingSpeak, setPendingSpeak] = useState("");

	if (pendingSpeak) {
		setPlaying(true);
		speak(pendingSpeak, () => {
			setPlaying(false);
		});
		setPendingSpeak("");
	}

	return (
		<div className="App screen">
			<div className="screen-header">
				<Logo>VocabPractice</Logo>

				<VocabSetInfo>Day of the week</VocabSetInfo>
			</div>

			<div className="screen-content">
				<Counter>{vocabIndex + 1}</Counter>
				<SoundWave className={classNames({ play: isPlaying })} />
			</div>

			<div className="screen-footer">
				<PracticeNav>
					<PreviousButton
						onClick={(e) => {
							if (!isPlaying) {
								const newVocab = previousVocab();
								if (newVocab) {
									setPendingSpeak(newVocab);
								}
							}
						}}
					/>

					<PlayButton
						onClick={(e) => {
							if (!isPlaying) {
								setPendingSpeak(repeatedVocab());
							}
						}}
					/>

					<SpellButton
						onClick={(e) => {
							if (!isPlaying) {
								setPendingSpeak(spellVocab());
							}
						}}
					/>

					<NextButton
						onClick={(e) => {
							if (!isPlaying) {
								const newVocab = nextVocab();
								if (newVocab) {
									setPendingSpeak(newVocab);
								}
							}
						}}
					/>
				</PracticeNav>
			</div>
		</div>
	);
}

// Chrome loads voices asynchronously.
speechSynthesis.getVoices();
window.speechSynthesis.onvoiceschanged = function (e) {
	var voices = speechSynthesis.getVoices();
};
export default App;
