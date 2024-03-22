import logo from "./logo.svg";
import "./App.scss";
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import SoundWave from "./sound-wave";
import classNames from "classnames";
import { useDetectClickOutside } from "react-detect-click-outside";
import vocabSets from "./vocab-sets.json";

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
	const [vocabSetInfo, setVocabSetInfo] = useState(
		vocabSets[Object.keys(vocabSets)[0]]
	);
	const vocabSet = vocabSetInfo.words;
	const [vocabIndex, setVocabIndex] = useState(0);

	const getCurrentVocab = () => vocabSet[vocabIndex];
	const createSpellVocab = (vocab) => {
		var a = vocab
			.replace(/(.)\1*/g, (match, p1) => {
				if (match.length === 1) {
					return `${p1}, `;
				} else {
					return `double, ${p1} , `;
				}
			})
			.trim();
		return a;
	};
	const createRepeatedVocab = (vocab) => {
		return `${vocab} , , ${vocab}`;
	};

	const changeVocabSet = (slug) => {
		setVocabSetInfo(vocabSets[slug]);
		setVocabIndex(0);
	};

	return {
		changeVocabSet,
		vocabSetInfo,
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

function useTts(lang = "en") {
	const speaker = new SpeechSynthesisUtterance();

	let preferredVoices = {
		"Google US English": {
			volume: parseFloat(1), // 0.0 - 1.0
			rate: parseFloat(0.7), // 0.1 - 10.0
			pitch: parseFloat(1.2), // 0.0 - 2.0
		},
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
		// Karen, Moira, Samantha, Xander, Daniel, Tessa
		// Rocko, Shelley, Reed
		// Kanya (TH)
		Reed: {
			volume: parseFloat(1), // 0.0 - 1.0
			rate: parseFloat(0.85), // 0.1 - 10.0
			pitch: parseFloat(1.1), // 0.0 - 2.0
		},
	};

	// Use specific voice for better result
	if ("en" == lang) {
		speaker.lang = "en-US";
		speaker.rate = 0.8;
		speaker.voice = speechSynthesis.getVoices().filter(function (voice) {
			if ( voice.lang != speaker.lang) return false;

			const isCorrect = !!preferredVoices[voice.name];

			if (isCorrect) {
				// Set the attributes.
				speaker.rate = preferredVoices[voice.name].rate;
				speaker.volume = preferredVoices[voice.name].volume;
				speaker.pitch = preferredVoices[voice.name].pitch;
			}

			return isCorrect;
		})[0];
	} else if ("th" == lang) {
		speaker.lang = "th-TH";
	}

	return {
		speak: (text, onEnd = null) => {
			// Create a new instance of SpeechSynthesisUtterance.
			// var msg = new SpeechSynthesisUtterance();
			// msg.voice = speechSynthesis.getVoices().filter(function (voice) {
			// 	const isCorrect = voice.name == "English United States";

			// 	return isCorrect;
			// })[0];
			// msg.rate = 0.1;

			var msg = speaker;

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

				msg.addEventListener("error", (event) => {
					console.log(
						`Utterance has finished being spoken after ${event.elapsedTime} seconds.`
					);
					onEnd();
				});

				msg.addEventListener("pause", (event) => {
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
	const { isPlayIcon, ...childProps } = props;
	return (
		<ButtonBody className="play-button" {...childProps}>
			{props.isPlayIcon && (
				<svg version="1.1" viewBox="0 0 512 512">
					<path d="M405.2,232.9L126.8,67.2c-3.4-2-6.9-3.2-10.9-3.2c-10.9,0-19.8,9-19.8,20H96v344h0.1c0,11,8.9,20,19.8,20  c4.1,0,7.5-1.4,11.2-3.4l278.1-165.5c6.6-5.5,10.8-13.8,10.8-23.1C416,246.7,411.8,238.5,405.2,232.9z" />
				</svg>
			)}
			{!props.isPlayIcon && (
				<svg version="1.1" viewBox="0 0 32 32">
					<path d="M28,16c-1.219,0-1.797,0.859-2,1.766C25.269,21.03,22.167,26,16,26c-5.523,0-10-4.478-10-10S10.477,6,16,6  c2.24,0,4.295,0.753,5.96,2H20c-1.104,0-2,0.896-2,2s0.896,2,2,2h6c1.104,0,2-0.896,2-2V4c0-1.104-0.896-2-2-2s-2,0.896-2,2v0.518  C21.733,2.932,18.977,2,16,2C8.268,2,2,8.268,2,16s6.268,14,14,14c9.979,0,14-9.5,14-11.875C30,16.672,28.938,16,28,16z" />
				</svg>
			)}
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
	background: rgba(255, 255, 255, 0.2);
`;

const ListButton = styled((props) => {
	return (
		<div {...props}>
			<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
				<path d="M48 208C21.49 208 0 229.5 0 256s21.49 48 48 48S96 282.5 96 256S74.51 208 48 208zM48 368C21.49 368 0 389.5 0 416s21.49 48 48 48S96 442.5 96 416S74.51 368 48 368zM48 48C21.49 48 0 69.49 0 96s21.49 48 48 48S96 122.5 96 96S74.51 48 48 48zM192 128h288c17.67 0 32-14.33 32-31.1S497.7 64 480 64H192C174.3 64 160 78.33 160 95.1S174.3 128 192 128zM480 224H192C174.3 224 160 238.3 160 256s14.33 32 32 32h288c17.67 0 32-14.33 32-32S497.7 224 480 224zM480 384H192c-17.67 0-32 14.33-32 32s14.33 32 32 32h288c17.67 0 32-14.33 32-32S497.7 384 480 384z" />
			</svg>
		</div>
	);
})`
	cursor: pointer;
	border-radius: 8px;
	padding: 0.5em;
	background: rgba(255, 255, 255, 0.6);
	transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	display: flex;
	align-items: center;

	&:hover {
		background: white;
	}

	svg {
		display: block;
		width: 14px;
		height: auto;
		fill: #b47f87;
	}
`;

function App() {
	const [selectedVocabSet, setVocabSet] = useState();

	const {
		changeVocabSet,
		vocabSetInfo,
		vocabIndex,
		currentVocab,
		repeatedVocab,
		spellVocab,
		nextVocab,
		previousVocab,
	} = useVocabSet();
	const { speak } = useTts(vocabSetInfo.lang, [vocabSetInfo.lang]);
	const [isSideNavOpen, setSideNavOpen] = useState(false);
	const [isPlaying, setPlaying] = useState(false);
	const [pendingSpeak, setPendingSpeak] = useState("");
	const sideNavRef = useDetectClickOutside({
		onTriggered: () => {
			if (isSideNavOpen) {
				setSideNavOpen(false);
			}
		},
	});
	const [isFirstLoad, setFirstLoad] = useState(true);

	const onChangeVocabSet = (slug) => {
		setPendingSpeak("");
		setSideNavOpen(false);
		setPlaying(false);
		setFirstLoad(true);
		changeVocabSet(slug);
	};

	if (pendingSpeak) {
		setPlaying(true);
		speak(pendingSpeak, () => {
			setPlaying(false);
			setFirstLoad(false);
		});
		setPendingSpeak("");
	}

	return (
		<div className="App screen">
			<div className="screen-header">
				<Logo>VocabPractice</Logo>

				<div className="main-nav">
					<VocabSetInfo>{vocabSetInfo.title}</VocabSetInfo>
					<ListButton
						onClick={(e) => {
							setSideNavOpen(!isSideNavOpen);
							e.stopPropagation();
						}}
					/>
				</div>
			</div>

			<div className="screen-content">
				<Counter>{vocabIndex + 1}</Counter>
				<SoundWave className={classNames({ play: isPlaying })} />
			</div>

			<div className="screen-footer">
				<PracticeNav>
					<PreviousButton
						onClick={(e) => {
							const newVocab = previousVocab();
							if (newVocab) {
								setPendingSpeak(newVocab);
							}
						}}
					/>

					<PlayButton
						isPlayIcon={isFirstLoad}
						onClick={(e) => {
							setPendingSpeak(currentVocab);
						}}
					/>

					<SpellButton
						onClick={(e) => {
							setPendingSpeak(spellVocab());
						}}
					/>

					<NextButton
						onClick={(e) => {
							const newVocab = nextVocab();
							if (newVocab) {
								setPendingSpeak(newVocab);
							}
						}}
					/>
				</PracticeNav>
			</div>

			<div
				ref={sideNavRef}
				className={classNames("side-nav", {
					"is-open": isSideNavOpen,
				})}
			>
				<ul className="vocab-set-list">
					{Object.keys(vocabSets).map((slug, i) => {
						return (
							<li key={i}>
								<span onClick={() => onChangeVocabSet(slug)}>
									{vocabSets[slug].title}
								</span>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}

// Required to fix bug in iOS (first read has no have onend event)
new SpeechSynthesisUtterance();

// Chrome loads voices asynchronously.
speechSynthesis.getVoices();
window.speechSynthesis.onvoiceschanged = function (e) {
	var voices = speechSynthesis.getVoices();
};
export default App;
