import { a as PAYOUT_MIN, c as firebaseConfig, d as manilaPeriod, f as peso, i as MEMBERSHIP_FEE, n as LEVEL_BONUS, o as dayIndex, t as DIRECT_BONUS, u as isMasterEmail } from "./manila-BaDjFwMm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firebase.server-BC4SNhK7.js
var lesson = (chapters, exercises) => ({
	chapters,
	exercises
});
var CATALOG = [
	{
		id: "projects",
		title: "How to use ChatGPT Projects",
		description: "Set up ChatGPT Projects so the same instructions and files are there every morning.",
		difficulty: "Start",
		durationMin: 22,
		thumbnail: "/covers/projects.jpg",
		reel: "/reels/projects.mp4",
		muxPlaybackId: "",
		tags: ["ChatGPT", "Setup"],
		sortOrder: 0,
		lesson: lesson([
			{
				id: "c1",
				title: "Create the project",
				minutes: 7,
				body: "Open ChatGPT and choose Projects in the sidebar, then New project. Name it the way you would search for it later: the client, the job, and the result, such as 'Northwind weekly brief'. Open Project settings and write custom instructions in three lines. Line one: who the reader is. Line two: what the model must not invent, such as prices, dates, or quotes. Line three: the shape of a finished answer, such as 'five bullets, then one question for me'. Claude Projects uses the same idea under Projects if you work there instead. If you cannot write those three lines, you are not ready to save the chat."
			},
			{
				id: "c2",
				title: "Add only the files that matter",
				minutes: 8,
				body: "In the project, use Add files. Upload the source of truth: a style guide, a price list, last month's brief. Skip old archives you would not hand a new hire. Start a chat inside that project, not a blank chat, so the instructions stay attached. Ask a question you already know the answer to. If the reply misses the file, the file is too long. Split it into a shorter document and upload that. Do not pile on more instructions to hide a bad file."
			},
			{
				id: "c3",
				title: "Save one prompt you can reuse",
				minutes: 7,
				body: "Pin a starter message at the top of the project chat. It should say the job, the inputs you will paste, and the output format. Tomorrow, paste new notes under that same message. You should get the same shape back. That repeat is the reason to use Projects instead of a fresh chat. If the second day drifts, tighten the third instruction line before you add tools or GPTs."
			}
		], [
			{
				id: "e1",
				prompt: "Write the three custom-instruction lines for a real ChatGPT Project.",
				hint: "Reader, what not to invent, finished shape."
			},
			{
				id: "e2",
				prompt: "Name two files you would upload, and one you would leave out.",
				hint: "Leave out anything you would not hand a new hire."
			},
			{
				id: "e3",
				prompt: "Draft the reusable starter message in under 80 words.",
				hint: "Job, inputs, output format."
			}
		])
	},
	{
		id: "cursor",
		title: "How to use Cursor",
		description: "Install Cursor, write one rule, and make the editor follow it on the next edit.",
		difficulty: "Intermediate",
		durationMin: 26,
		thumbnail: "/covers/cursor.jpg",
		reel: "/reels/cursor.mp4",
		muxPlaybackId: "",
		tags: ["Cursor", "Coding"],
		sortOrder: 1,
		lesson: lesson([
			{
				id: "c1",
				title: "Open the project and the rules file",
				minutes: 8,
				body: "Install Cursor from cursor.com and open the folder you actually work in with File, then Open Folder. Cursor reads rules from .cursor/rules in that folder. Create one rule file for one mistake you keep repeating. Write three lines: the bad pattern, the good pattern, and the folders it applies to. A rule that describes your whole taste gets ignored. A rule that forbids one concrete thing gets followed. Use Chat in the side pane only after the rule file is saved."
			},
			{
				id: "c2",
				title: "Ask for a small edit",
				minutes: 9,
				body: "Select the function that went wrong last time. Press Cmd-K or Ctrl-K and ask for one change, not a rewrite of the app. Name the file and the behavior you want. If the edit touches tests and app code for no reason, reject it and narrow the selection. Put shared rules in .cursor/rules at the root. Put a rule that only the tests care about in a rule whose globs match the test folder. If two rules disagree, delete one today."
			},
			{
				id: "c3",
				title: "Check that the rule fired",
				minutes: 9,
				body: "Ask Cursor to do the task that used to go wrong. If it misses, the rule has no example. Paste a six-line before-and-after from your own code into the rule file and ask again. Do not switch models until the example is in the file. Agent mode can edit many files. Use it only when the single-file edit already followed the rule. Rules without an example are wishes."
			}
		], [
			{
				id: "e1",
				prompt: "Turn one review comment into a three-line Cursor rule.",
				hint: "Bad pattern, good pattern, where it applies."
			},
			{
				id: "e2",
				prompt: "Say whether that rule is global or limited to one folder.",
				hint: "If only tests care, do not make it global."
			},
			{
				id: "e3",
				prompt: "Add a six-line before-and-after from your code.",
				hint: "Your code, not a toy."
			}
		])
	},
	{
		id: "n8n",
		title: "How to use n8n with an AI node",
		description: "Build one n8n workflow: a trigger, an OpenAI or Claude step, and a human approve button.",
		difficulty: "Intermediate",
		durationMin: 30,
		thumbnail: "/covers/n8n.jpg",
		reel: "/reels/n8n.mp4",
		muxPlaybackId: "",
		tags: ["n8n", "Automation"],
		sortOrder: 2,
		lesson: lesson([
			{
				id: "c1",
				title: "Start a workflow from one inbox",
				minutes: 10,
				body: "In n8n, create a workflow and add the trigger you really have: Gmail Trigger, or a Webhook if a form posts in. Do not add five apps. On paper, write the path: trigger, classify, draft, stop. The stop is the product. Add a Gmail or Slack node that sends the draft to you, not to the customer. A draft that sends itself will embarrass you once, and then you will turn the workflow off."
			},
			{
				id: "c2",
				title: "Classify before you draft",
				minutes: 10,
				body: "Add an OpenAI node, or an HTTP Request node to the Claude API. The first prompt only returns one label: billing, scheduling, noise, or needs-a-human. Add an IF or Switch node on that label. Only billing and scheduling continue to a second AI node that writes a draft. Noise goes to an archive step. Needs-a-human stops. Constraining the labels is what keeps the workflow small enough to trust. Put 'do not invent prices or dates' in the draft prompt, and tell it to leave a blank when the email did not say."
			},
			{
				id: "c3",
				title: "Approve, then log the miss",
				minutes: 10,
				body: "The last step before anything is sent to a customer is a manual check: you read the draft in Slack or email and you send it yourself. Every time you rewrite a draft, paste the original and your edit into a note. After ten, add the repeated fix to the system prompt on the AI node. Turn the workflow Active only after three real messages pass the check. Automation that never eats its corrections just gets louder."
			}
		], [
			{
				id: "e1",
				prompt: "Name the n8n trigger and the two labels allowed to draft.",
				hint: "Everything else waits for you."
			},
			{
				id: "e2",
				prompt: "Write who reads the draft, and in which app.",
				hint: "If nobody is named, it will auto-send."
			},
			{
				id: "e3",
				prompt: "Write the system line that forbids invented prices or dates.",
				hint: "Say what to do instead: leave a blank."
			}
		])
	},
	{
		id: "ollama",
		title: "How to use Ollama",
		description: "Install Ollama, pull a small model, and call it from the terminal and a short script.",
		difficulty: "Start",
		durationMin: 24,
		thumbnail: "/covers/ollama.jpg",
		reel: "/reels/ollama.mp4",
		muxPlaybackId: "",
		tags: ["Ollama", "Local"],
		sortOrder: 3,
		lesson: lesson([
			{
				id: "c1",
				title: "Install it and pull one model",
				minutes: 8,
				body: "Download Ollama from ollama.com and install it. In the terminal, run ollama pull llama3.2, or another small model that answers on your machine in a few seconds. Do not start with the largest file you can download. Write down the exact name from ollama list. 'The local one' is how you lose a week. Run ollama run llama3.2 and ask one question so you know the app is awake. This loop needs no ChatGPT account. The model stays on your computer."
			},
			{
				id: "c2",
				title: "Call the local API",
				minutes: 8,
				body: "Ollama listens at http://localhost:11434. From the terminal, POST a JSON prompt to /api/generate with the model name and stream set to false. Then send the same request from a ten-line script in Python or Node. Print the status and the text field. If you wrap it in a framework today, you will not know which layer failed tomorrow. Keep the script boring: input, request, print."
			},
			{
				id: "c3",
				title: "Know when to leave the machine",
				minutes: 8,
				body: "Use Ollama for drafts, sorting, and anything you cannot send to ChatGPT or Claude. It is the wrong tool when you need today's news or a long, careful document. Write that limit as a comment at the top of the script. When the task crosses the limit, call a hosted model on purpose instead of hoping a bigger local download will fix it."
			}
		], [
			{
				id: "e1",
				prompt: "Write the exact ollama pull command you would run, and why that model is small enough.",
				hint: "Seconds, not a slideshow."
			},
			{
				id: "e2",
				prompt: "Sketch the ten-line script: input, request, print.",
				hint: "No framework. localhost:11434."
			},
			{
				id: "e3",
				prompt: "Write the comment that says what this model must not do.",
				hint: "Fresh facts, or a finished long document."
			}
		])
	},
	{
		id: "evals",
		title: "How to test a prompt before you trust it",
		description: "Score twenty real examples in a sheet, then rerun them in ChatGPT or Claude.",
		difficulty: "Advanced",
		durationMin: 28,
		thumbnail: "/covers/evals.jpg",
		reel: "/reels/evals.mp4",
		muxPlaybackId: "",
		tags: ["ChatGPT", "Quality"],
		sortOrder: 4,
		lesson: lesson([
			{
				id: "c1",
				title: "Build the sheet from real misses",
				minutes: 9,
				body: "Open a spreadsheet. Make columns: input, wanted answer, model answer, facts, format, usable. Collect twenty real inputs from the last month, ten that went well and ten that cost you time. Do not invent clever cases. Paste each input into ChatGPT or Claude with the prompt you want to judge, and paste the reply into model answer. Twenty rows is a test. Five rows is a vibe."
			},
			{
				id: "c2",
				title: "Score with three yes or no checks",
				minutes: 10,
				body: "For each row, type 0 or 1 in three columns. Facts: it used only what you gave. Format: it matched the shape you asked for. Usable: a colleague would send it without a rewrite. Average the three. Do not use a ten-point scale. You cannot explain the difference between a 6 and a 7, and the sheet will lie to you. The tool is the spreadsheet. The model is only the thing being scored."
			},
			{
				id: "c3",
				title: "Change one line and rerun",
				minutes: 9,
				body: "Edit one line of the prompt. Run the same twenty inputs again in a new chat so old memory does not help. If the average does not move, the edit was taste, not a fix. Keep the winner, date it in the sheet, and delete the loser. A test you do not compare is a diary. When the score is stable, then you can paste that prompt into a Project or an n8n node."
			}
		], [
			{
				id: "e1",
				prompt: "Write five real rows: the input, and the answer you wanted.",
				hint: "Use misses from this month."
			},
			{
				id: "e2",
				prompt: "Write your three yes or no checks.",
				hint: "Facts, format, usable without a rewrite."
			},
			{
				id: "e3",
				prompt: "Name the single prompt line you would change first.",
				hint: "One line, then rerun the same rows."
			}
		])
	},
	{
		id: "rag",
		title: "How to use NotebookLM",
		description: "Load your own sources into NotebookLM and make it cite them or say it does not know.",
		difficulty: "Intermediate",
		durationMin: 32,
		thumbnail: "/covers/rag.jpg",
		reel: "/reels/rag.mp4",
		muxPlaybackId: "",
		tags: ["NotebookLM", "Search"],
		sortOrder: 5,
		lesson: lesson([
			{
				id: "c1",
				title: "Add sources, not a dump",
				minutes: 10,
				body: "Open NotebookLM and create a notebook for one job. Use the Add source button for the files a person would actually read: the brief, the policy, the price sheet. Google Docs, PDFs, and copied text all work. Do not upload every archive you have. If a document covers two topics, split it before you upload so the citations stay on one subject. The notebook can only know what you added."
			},
			{
				id: "c2",
				title: "Ask, then open the citation",
				minutes: 12,
				body: "Ask a question in the chat. NotebookLM attaches citations to the answer. Click each citation and check that the sentence really says what the answer claims. If you cannot find the sentence, the answer is a guess. Write your own replies the same way when you leave NotebookLM: passage first, answer second, so someone else can check in five seconds. The Audio Overview is a recap, not a source. Do not quote it as the file."
			},
			{
				id: "c3",
				title: "Make it stay quiet",
				minutes: 10,
				body: "Ask a question you know is not in the sources. A correct notebook says it cannot find that, or answers only from a weak citation you can reject. If it invents a price, a date, or a policy, narrow the sources and ask again with the line: 'If the sources do not say, answer: not in the files.' A tool that cannot say nothing will eventually invent. When you need the same behavior in your own app, this is the test to copy: retrieve, show the sentence, or stay quiet."
			}
		], [
			{
				id: "e1",
				prompt: "List the three sources you would add to one NotebookLM notebook.",
				hint: "One job. No archives."
			},
			{
				id: "e2",
				prompt: "Write a question whose citation you could check in five seconds.",
				hint: "Passage first, answer second."
			},
			{
				id: "e3",
				prompt: "Write a question that should return 'not in the files.'",
				hint: "Pick a fact you know is absent."
			}
		])
	},
	{
		id: "product",
		title: "How to make product images in ChatGPT",
		description: "Use ChatGPT image generation for one object, one light, and a set you would actually post.",
		difficulty: "Start",
		durationMin: 20,
		thumbnail: "/covers/product.jpg",
		reel: "/reels/product.mp4",
		muxPlaybackId: "",
		tags: ["ChatGPT", "Images"],
		sortOrder: 6,
		lesson: lesson([
			{
				id: "c1",
				title: "Describe the object so it cannot wander",
				minutes: 6,
				body: "In ChatGPT, start a new chat and ask for an image. Describe the object as if you were insuring it: material, color, proportion, and what it is not. 'A cup' will change shape every frame. 'A matte stoneware cup, low and wide, no logo, no text' will stay. Generate one image. If the object changes, tighten those words before you chase lighting. Gemini's image tool takes the same kind of description if you are working there. Do not switch tools until one description holds still."
			},
			{
				id: "c2",
				title: "Keep one light and change the angle",
				minutes: 7,
				body: "Pick a single light and repeat it in every prompt: hard light from the left, or a soft window from the right. Change only the angle and the crop. Say that in the prompt: 'same cup, same light, three-quarter view'. Ten frames with ten moods look like a stock site. Ten frames with one light look like one brand. If ChatGPT drifts, reply on the same image with 'keep the object, only change the camera'. Starting a fresh chat starts a fresh object."
			},
			{
				id: "c3",
				title: "Reject before you post",
				minutes: 7,
				body: "Throw out extra objects, warped edges, and any text you did not ask for. Do not hide a bad frame in the caption. The set is the frames you would print. Three clean frames beat twelve almosts. Download the keepers from the chat. If you need type on the image, add it later in a normal editor. Image models still misspell words."
			}
		], [
			{
				id: "e1",
				prompt: "Write the insurance description of an object you sell or use.",
				hint: "Material, color, proportion, no logo, no text."
			},
			{
				id: "e2",
				prompt: "Name the one light in a sentence you can paste into ChatGPT.",
				hint: "Direction and hardness. Same object."
			},
			{
				id: "e3",
				prompt: "List the three reject rules you will enforce before posting.",
				hint: "Extra objects, warped edges, stray text."
			}
		])
	},
	{
		id: "voice",
		title: "How to use ChatGPT voice",
		description: "Turn on voice mode, keep one question at a time, and hand off anything that should not be spoken.",
		difficulty: "Intermediate",
		durationMin: 27,
		thumbnail: "/covers/voice.jpg",
		reel: "/reels/voice.mp4",
		muxPlaybackId: "",
		tags: ["ChatGPT", "Voice"],
		sortOrder: 7,
		lesson: lesson([
			{
				id: "c1",
				title: "Write the first twenty seconds",
				minutes: 9,
				body: "Before you tap the voice icon in the ChatGPT app, write the opening as lines, not as a personality. Who you are, why this session exists, and the one question that moves the task forward. Example: 'You are helping me outline today's tutorial. Ask which tool we are covering, then wait.' Paste that into the chat, then start voice. Read your lines out loud. If you run out of breath, the listener will stop. A backstory with no job just chatters."
			},
			{
				id: "c2",
				title: "One question, then wait",
				minutes: 9,
				body: "Tell voice mode: ask one question, then stop talking. Do not stack questions. Do not fill silence with a second offer. Silence is the person thinking. If it talks over you, interrupt and repeat the rule. Tap the voice button again to end the session when the task is done. You can use the same rule later in a phone agent such as Vapi or ElevenLabs, but learn the pause here first, where you can stop it with a thumb."
			},
			{
				id: "c3",
				title: "Hand off what should not be spoken",
				minutes: 9,
				body: "Payments, medical detail, and anything the person must compare should not be spoken at them. Say so in the instructions: offer to write it in the chat, or tell them to talk to a person. Practice one of those exits out loud before you pick a fancier voice. A pleasant voice on the wrong task is still the wrong task. When the spoken answer matters, copy it into the text thread so you can check it."
			}
		], [
			{
				id: "e1",
				prompt: "Write the first twenty seconds as lines you can read aloud.",
				hint: "Who, why, one question."
			},
			{
				id: "e2",
				prompt: "Write the instruction: one question, then wait.",
				hint: "No second offer."
			},
			{
				id: "e3",
				prompt: "Name two topics this voice session must hand back to text or a person.",
				hint: "If they must compare it, don't speak it."
			}
		])
	}
];
var BASE = `${firebaseConfig.databaseURL}/dailyConnect`;
async function rget(path) {
	const res = await fetch(`${BASE}${path}.json`);
	if (!res.ok) throw new Error("Could not reach the membership database.");
	return await res.json();
}
async function rput(path, value) {
	if (!(await fetch(`${BASE}${path}.json`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(value)
	})).ok) throw new Error("Could not save.");
}
async function rpatch(path, value) {
	if (!(await fetch(`${BASE}${path}.json`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(value)
	})).ok) throw new Error("Could not save.");
}
function authMessage(raw) {
	const code = raw.split(":")[0]?.trim() ?? raw;
	if (code === "EMAIL_EXISTS") return "An account already uses that email. Sign in instead.";
	if (code === "EMAIL_NOT_FOUND" || code === "INVALID_PASSWORD" || code === "INVALID_LOGIN_CREDENTIALS") return "Email or password doesn’t match.";
	if (code === "WEAK_PASSWORD") return "Use at least 8 characters.";
	if (code === "INVALID_EMAIL") return "That email doesn’t look right.";
	if (code === "TOO_MANY_ATTEMPTS_TRY_LATER") return "Too many attempts. Wait a minute and try again.";
	return "Could not sign in. Try again.";
}
async function identity(path, body) {
	const res = await fetch(`https://identitytoolkit.googleapis.com/v1/${path}?key=${firebaseConfig.apiKey}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	});
	const data = await res.json();
	if (!res.ok) throw new Error(authMessage(data.error?.message ?? "AUTH"));
	return data;
}
function asRecord(value) {
	if (value && typeof value === "object" && !Array.isArray(value)) return value;
	return {};
}
function asStringList(value) {
	if (Array.isArray(value)) return value.filter((item) => typeof item === "string");
	return Object.keys(asRecord(value)).sort((a, b) => Number(a) - Number(b)).map((key) => asRecord(value)[key]).filter((item) => typeof item === "string");
}
function uidOk(uid) {
	return /^[A-Za-z0-9]{8,128}$/.test(uid);
}
function cleanCode(code) {
	const next = (code ?? "").trim().toUpperCase();
	if (!next) return "";
	if (!/^[A-Z0-9]{4,12}$/.test(next)) return "";
	return next;
}
function digits(phone) {
	return phone.replace(/\D/g, "");
}
async function verify(idToken) {
	const user = (await identity("accounts:lookup", { idToken })).users?.[0];
	if (!user?.localId) throw new Error("Sign in again.");
	return {
		uid: user.localId,
		email: user.email ?? "",
		name: user.displayName ?? ""
	};
}
function toSession(input) {
	return {
		idToken: input.idToken,
		refreshToken: input.refreshToken,
		uid: input.localId,
		email: input.email,
		expiresAt: Date.now() + Number(input.expiresIn || 3600) * 1e3
	};
}
async function updateUser(uid, mutate) {
	const url = `${BASE}/users/${uid}.json`;
	for (let attempt = 0; attempt < 4; attempt += 1) {
		const res = await fetch(url, { headers: { "X-Firebase-ETag": "true" } });
		if (!res.ok) throw new Error("Could not read membership.");
		const etag = res.headers.get("etag");
		const current = await res.json();
		if (!current) throw new Error("Member not found.");
		const next = mutate(current);
		const putRes = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...etag ? { "if-match": etag } : {}
			},
			body: JSON.stringify(next)
		});
		if (putRes.status === 412) continue;
		if (!putRes.ok) throw new Error("Could not save membership.");
		return next;
	}
	throw new Error("Could not save membership. Try again.");
}
async function resolveSponsor(uid, code) {
	if (!code) return null;
	const sponsorId = await rget(`/referralCodes/${code}`);
	if (!sponsorId || sponsorId === uid || !uidOk(sponsorId)) return null;
	const sponsor = await rget(`/users/${sponsorId}`);
	if (!sponsor || sponsor.membershipStatus !== "active") return null;
	return sponsorId;
}
async function createProfile(input) {
	const existing = await rget(`/users/${input.uid}`);
	if (existing) {
		if (!existing.name && input.name || !existing.phone && input.phone) return updateUser(input.uid, (user) => ({
			...user,
			name: user.name || input.name,
			phone: user.phone || input.phone,
			email: user.email || input.email
		}));
		return existing;
	}
	const phone = digits(input.phone);
	if (phone && phone.length < 10) throw new Error("Enter a mobile number with at least 10 digits, or leave it blank.");
	const sponsorId = await resolveSponsor(input.uid, cleanCode(input.referralCode));
	const profile = {
		uid: input.uid,
		name: input.name.trim() || input.email.split("@")[0] || "Member",
		email: input.email,
		phone,
		facebook: "",
		whatsapp: "",
		membershipStatus: "inactive",
		referralCode: null,
		sponsorId,
		placementParentId: null,
		walletBalance: 0,
		joinDate: null,
		createdAt: Date.now()
	};
	await rput(`/users/${input.uid}`, profile);
	if (sponsorId) {
		await rput(`/bySponsor/${sponsorId}/${input.uid}`, {
			name: profile.name,
			membershipStatus: "inactive",
			placed: false
		});
		if (input.cookieTimestamp) await rpatch(`/users/${input.uid}`, { sponsorCookieAt: input.cookieTimestamp });
	}
	return profile;
}
async function signUpWithEmail(input) {
	if (digits(input.phone ?? "").length < 10) throw new Error("Enter a mobile number with at least 10 digits.");
	const created = await identity("accounts:signUp", {
		email: input.email.trim(),
		password: input.password,
		returnSecureToken: true
	});
	await identity("accounts:update", {
		idToken: created.idToken,
		displayName: input.name.trim(),
		returnSecureToken: false
	}).catch(() => void 0);
	return {
		session: toSession(created),
		profile: await createProfile({
			uid: created.localId,
			email: created.email,
			name: input.name,
			phone: input.phone ?? "",
			referralCode: input.referralCode ?? "",
			cookieTimestamp: input.cookieTimestamp
		})
	};
}
async function signInWithEmail(input) {
	const signed = await identity("accounts:signInWithPassword", {
		email: input.email.trim(),
		password: input.password,
		returnSecureToken: true
	});
	return {
		session: toSession(signed),
		profile: await createProfile({
			uid: signed.localId,
			email: signed.email,
			name: signed.displayName ?? "",
			phone: "",
			referralCode: ""
		})
	};
}
async function refresh(refreshToken) {
	const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken
		})
	});
	const data = await res.json();
	if (!res.ok || !data.id_token || !data.user_id) {
		const message = data.error?.message ?? "";
		if (/INVALID_REFRESH_TOKEN|TOKEN_EXPIRED|USER_DISABLED|USER_NOT_FOUND/.test(message)) throw new Error("SESSION_REVOKED");
		throw new Error("Could not refresh the sign-in. Stay on this screen and try again.");
	}
	return {
		idToken: data.id_token,
		refreshToken: data.refresh_token ?? refreshToken,
		uid: data.user_id,
		email: "",
		expiresAt: Date.now() + Number(data.expires_in ?? 3600) * 1e3
	};
}
async function ensureProfile(input) {
	const who = await verify(input.idToken);
	if (!await rget(`/users/${who.uid}`) && digits(input.phone ?? "").length < 10) throw new Error("Enter a mobile number with at least 10 digits.");
	return createProfile({
		uid: who.uid,
		email: who.email,
		name: input.name || who.name,
		phone: input.phone ?? "",
		referralCode: input.referralCode ?? "",
		cookieTimestamp: input.cookieTimestamp
	});
}
async function loadSponsorCard(code) {
	const clean = cleanCode(code);
	if (!clean) return null;
	const sponsorId = await rget(`/referralCodes/${clean}`);
	if (!sponsorId || !uidOk(sponsorId)) return null;
	const sponsor = await rget(`/users/${sponsorId}`);
	if (!sponsor || sponsor.membershipStatus !== "active") return null;
	return publicSponsorCard(sponsor);
}
async function loadMySponsor(idToken) {
	const profile = await requireUser(idToken);
	if (!profile.sponsorId) return null;
	const sponsor = await rget(`/users/${profile.sponsorId}`);
	if (!sponsor) return null;
	return publicSponsorCard(sponsor);
}
async function publicSponsorCard(sponsor) {
	return {
		name: sponsor.name,
		phone: sponsor.phone || "",
		facebook: sponsor.facebook || "",
		whatsapp: sponsor.whatsapp || ""
	};
}
function cleanFacebook(raw) {
	const value = raw.trim();
	if (!value) return "";
	const withProto = /^https?:\/\//i.test(value) ? value : `https://${value}`;
	let url;
	try {
		url = new URL(withProto);
	} catch {
		throw new Error("Facebook link should look like facebook.com/your-name.");
	}
	if (!/(^|\.)facebook\.com$|(^|\.)fb\.com$/i.test(url.hostname)) throw new Error("Use a facebook.com profile link.");
	return url.toString().slice(0, 200);
}
function cleanWhatsapp(raw) {
	const value = raw.trim();
	if (!value) return "";
	if (/^https?:\/\//i.test(value)) {
		let url;
		try {
			url = new URL(value);
		} catch {
			throw new Error("That WhatsApp link is not valid.");
		}
		if (!/(^|\.)wa\.me$|(^|\.)whatsapp\.com$/i.test(url.hostname)) throw new Error("Use a wa.me link or a mobile number.");
		return url.toString().slice(0, 200);
	}
	const number = value.replace(/\D/g, "");
	if (number.length < 10 || number.length > 15) throw new Error("WhatsApp number needs 10 to 15 digits.");
	return number;
}
async function savePublicContact(input) {
	const profile = await requireUser(input.idToken);
	const phone = digits(input.phone);
	if (phone && phone.length < 10) throw new Error("Enter a mobile number with at least 10 digits, or leave it blank.");
	const facebook = cleanFacebook(input.facebook);
	const whatsapp = cleanWhatsapp(input.whatsapp);
	return updateUser(profile.uid, (user) => ({
		...user,
		phone,
		facebook,
		whatsapp
	}));
}
async function loadProfile(idToken) {
	const profile = await rget(`/users/${(await verify(idToken)).uid}`);
	if (!profile) throw new Error("Sign in again.");
	return profile;
}
async function requireUser(idToken) {
	const profile = await rget(`/users/${(await verify(idToken)).uid}`);
	if (!profile) throw new Error("Sign in again.");
	return profile;
}
async function requireMember(idToken) {
	const profile = await requireUser(idToken);
	if (profile.membershipStatus !== "active") throw new Error("Membership required.");
	return profile;
}
async function requireActiveMember(idToken) {
	return requireMember(idToken);
}
async function postLedger(input) {
	if (!/^[A-Za-z0-9_-]{4,64}$/.test(input.txId)) throw new Error("Invalid ledger id.");
	if (!Number.isFinite(input.amount) || input.amount === 0) throw new Error("Invalid amount.");
	const path = `/walletTransactions/${input.uid}/${input.txId}`;
	const prior = await rget(path);
	if (prior) {
		const user = await rget(`/users/${input.uid}`);
		return {
			applied: false,
			balance: Number(user?.walletBalance ?? 0)
		};
	}
	const claim = await fetch(`${BASE}${path}.json?print=silent`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"if-none-match": "*"
		},
		body: JSON.stringify({
			userId: input.uid,
			type: input.type,
			amount: input.amount,
			status: input.status ?? "posted",
			period: manilaPeriod(),
			note: input.note.slice(0, 180),
			sourceUserId: input.sourceUserId ?? null,
			createdAt: Date.now()
		})
	});
	if (claim.status === 412 || claim.status === 409) {
		const user = await rget(`/users/${input.uid}`);
		return {
			applied: false,
			balance: Number(user?.walletBalance ?? 0)
		};
	}
	if (!claim.ok) throw new Error("Could not write the ledger.");
	const again = await rget(path);
	if (again && again.createdAt !== void 0 && prior) {
		const user = await rget(`/users/${input.uid}`);
		return {
			applied: false,
			balance: Number(user?.walletBalance ?? 0)
		};
	}
	return {
		applied: true,
		balance: (await updateUser(input.uid, (user) => ({
			...user,
			walletBalance: user.walletBalance + input.amount
		}))).walletBalance
	};
}
async function seedTutorials() {
	if (await rget("/tutorialCatalogVersion") === 2) return;
	await Promise.all(CATALOG.map((tutorial) => rput(`/tutorials/${tutorial.id}`, tutorial)));
	await rput("/tutorialCatalogVersion", 2);
}
function orderedTutorials(raw) {
	return Object.values(raw ?? {}).sort((a, b) => a.sortOrder - b.sortOrder);
}
function toCard(tutorial) {
	return {
		id: tutorial.id,
		title: tutorial.title,
		description: tutorial.description,
		difficulty: tutorial.difficulty,
		durationMin: tutorial.durationMin,
		thumbnail: tutorial.thumbnail,
		reel: tutorial.reel,
		muxPlaybackId: tutorial.muxPlaybackId ?? "",
		tags: Array.isArray(tutorial.tags) ? tutorial.tags : asStringList(tutorial.tags),
		sortOrder: tutorial.sortOrder
	};
}
function readProgress(tutorialId, raw) {
	const row = asRecord(raw);
	if (!row.tutorialId && !row.progressPercent && row.progressPercent !== 0) return null;
	return {
		tutorialId: typeof row.tutorialId === "string" ? row.tutorialId : tutorialId,
		progressPercent: Number(row.progressPercent ?? 0),
		completed: Boolean(row.completed),
		lastPositionSec: Number(row.lastPositionSec ?? 0),
		exercises: asStringList(row.exercises),
		updatedAt: Number(row.updatedAt ?? 0)
	};
}
async function noticesFor(uid) {
	const raw = await rget(`/notifications/${uid}`);
	return Object.entries(raw ?? {}).map(([id, notice]) => ({
		...notice,
		id
	})).sort((a, b) => b.createdAt - a.createdAt).slice(0, 20);
}
async function loadDesk(idToken) {
	const profile = await requireUser(idToken);
	await seedTutorials();
	const tutorials = orderedTutorials(await rget("/tutorials"));
	const today = tutorials[dayIndex(tutorials.length)];
	const progressRaw = await rget(`/userProgress/${profile.uid}`);
	const progress = Object.entries(progressRaw ?? {}).map(([id, row]) => readProgress(id, row)).filter((row) => row !== null);
	const notifications = await noticesFor(profile.uid);
	return {
		profile,
		todayId: today?.id ?? "",
		tutorials: tutorials.map(toCard),
		progress,
		notifications,
		unread: notifications.filter((notice) => !notice.read).length
	};
}
async function loadTutorial(idToken, tutorialId) {
	const profile = await requireMember(idToken);
	const tutorial = await rget(`/tutorials/${tutorialId}`);
	if (!tutorial) throw new Error("That tutorial is gone.");
	return {
		tutorial,
		progress: readProgress(tutorialId, await rget(`/userProgress/${profile.uid}/${tutorialId}`))
	};
}
async function saveProgress(input) {
	const profile = await requireMember(input.idToken);
	const progress = {
		tutorialId: input.tutorialId,
		progressPercent: Math.round(input.progressPercent),
		completed: input.completed || input.progressPercent >= 100,
		lastPositionSec: Math.round(input.lastPositionSec),
		exercises: input.exercises,
		updatedAt: Date.now()
	};
	await rput(`/userProgress/${profile.uid}/${input.tutorialId}`, progress);
	return progress;
}
async function mintCode(uid, name) {
	const stem = name.normalize("NFD").replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "DC";
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	for (let attempt = 0; attempt < 6; attempt += 1) {
		const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(4));
		let rand = "";
		for (const byte of bytes) rand += alphabet[byte % 32];
		const code = (stem + rand).slice(0, 8);
		if (!await rget(`/referralCodes/${code}`)) {
			await rput(`/referralCodes/${code}`, uid);
			return code;
		}
	}
	throw new Error("Could not mint a referral code. Try again.");
}
async function readUploadedVideo(id) {
	if (!/^v[a-z0-9]+$/i.test(id)) return null;
	const row = await rget(`/mediaFiles/${id}`);
	if (!row?.data) return null;
	return {
		mime: row.mime || "video/mp4",
		data: row.data
	};
}
async function masterAccess(idToken) {
	const who = await verify(idToken);
	return {
		email: who.email,
		allowed: isMasterEmail(who.email)
	};
}
async function saveActivationCode(record) {
	await rput(`/activationCodes/${record.code}`, record);
	await rput(`/activationCodeList/${record.code}`, record);
}
function asCodeRecord(code, raw) {
	const usedByUid = raw.usedByUid || raw.redeemedBy || null;
	const usedAt = raw.usedAt || raw.redeemedAt || null;
	return {
		code,
		status: raw.status === "used" || usedByUid ? "used" : "available",
		createdAt: raw.createdAt ?? 0,
		createdByUid: raw.createdByUid || raw.issuedBy || "",
		createdByEmail: raw.createdByEmail || "",
		createdByName: raw.createdByName || "",
		createdWhere: raw.createdWhere || "",
		sponsorId: raw.sponsorId || "",
		sponsorCode: raw.sponsorCode || "",
		sponsorName: raw.sponsorName || "",
		usedAt,
		usedByUid,
		usedByName: raw.usedByName || null,
		usedByEmail: raw.usedByEmail || null,
		issuedBy: raw.issuedBy || raw.createdByUid || "",
		redeemedBy: usedByUid,
		redeemedAt: usedAt
	};
}
async function issueActivationCode(idToken) {
	const who = await verify(idToken);
	if (!isMasterEmail(who.email)) throw new Error("Only master@dailyconnect.tech can create activation codes.");
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	for (let attempt = 0; attempt < 6; attempt += 1) {
		const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(8));
		let code = "";
		for (const byte of bytes) code += alphabet[byte % 32];
		if (await rget(`/activationCodes/${code}`)) continue;
		await saveActivationCode({
			code,
			status: "available",
			createdAt: Date.now(),
			createdByUid: who.uid,
			createdByEmail: who.email,
			createdByName: who.name || "master@dailyconnect.tech",
			createdWhere: "/code/create",
			sponsorId: "",
			sponsorCode: "",
			sponsorName: "",
			usedAt: null,
			usedByUid: null,
			usedByName: null,
			usedByEmail: null,
			issuedBy: who.uid,
			redeemedBy: null,
			redeemedAt: null
		});
		return { code };
	}
	throw new Error("Could not issue a code. Try again.");
}
async function listSponsorCodes(idToken) {
	const raw = await rget(`/codesBySponsor/${(await requireMember(idToken)).uid}`);
	const codes = [];
	for (const code of Object.keys(raw ?? {})) {
		const row = await rget(`/activationCodes/${code}`);
		if (row && !row.redeemedBy) codes.push(code);
	}
	return { codes };
}
async function listIssuedCodes(idToken) {
	const who = await verify(idToken);
	if (!isMasterEmail(who.email)) throw new Error("Only master@dailyconnect.tech can view activation codes.");
	const raw = await rget("/activationCodes");
	const codes = [];
	for (const [code, row] of Object.entries(raw ?? {})) {
		const record = asCodeRecord(code, row ?? {});
		if (record.createdByUid && !record.createdByEmail) {
			const creator = await rget(`/users/${record.createdByUid}`);
			if (creator) {
				record.createdByEmail = creator.email || "";
				record.createdByName = record.createdByName || creator.name;
			}
		}
		if (record.sponsorId && !record.sponsorName) {
			const sponsor = await rget(`/users/${record.sponsorId}`);
			if (sponsor) record.sponsorName = sponsor.name;
		}
		if (record.usedByUid && !record.usedByName) {
			const member = await rget(`/users/${record.usedByUid}`);
			if (member) {
				record.usedByName = member.name;
				record.usedByEmail = member.email;
			}
		}
		await rput(`/activationCodeList/${code}`, record);
		codes.push(record);
	}
	codes.sort((a, b) => b.createdAt - a.createdAt);
	return { codes };
}
async function redeemActivationCode(input) {
	const profile = await requireUser(input.idToken);
	if (profile.membershipStatus === "active") return profile;
	const code = input.code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
	if (!/^[A-Z0-9]{8}$/.test(code)) throw new Error("Enter the activation code.");
	const stored = await rget(`/activationCodes/${code}`);
	if (!stored || !stored.issuedBy && !stored.createdByUid && !stored.createdAt) throw new Error("That activation code is not valid.");
	const record = asCodeRecord(code, stored);
	if (record.status === "used" || record.redeemedBy) throw new Error("That activation code was already used.");
	const next = await activateMembership(input.idToken);
	const usedAt = Date.now();
	let sponsorId = record.sponsorId;
	let sponsorName = record.sponsorName;
	let sponsorCode = record.sponsorCode;
	const linkedSponsor = profile.sponsorId;
	if (!sponsorId && linkedSponsor) {
		const sponsor = await rget(`/users/${linkedSponsor}`);
		sponsorId = linkedSponsor;
		sponsorName = sponsor?.name ?? "";
		sponsorCode = sponsor?.referralCode ?? "";
	}
	await saveActivationCode({
		...record,
		sponsorId,
		sponsorName,
		sponsorCode,
		status: "used",
		usedAt,
		usedByUid: profile.uid,
		usedByName: profile.name,
		usedByEmail: profile.email,
		redeemedBy: profile.uid,
		redeemedAt: usedAt
	});
	if (record.sponsorId) await rput(`/codesBySponsor/${record.sponsorId}/${code}`, null);
	return next;
}
async function activateMembership(idToken) {
	const profile = await requireUser(idToken);
	if (profile.membershipStatus === "active") return profile;
	const code = profile.referralCode ?? await mintCode(profile.uid, profile.name);
	const now = Date.now();
	if (profile.sponsorId && profile.sponsorId !== profile.uid) {
		if (!await rget(`/referrals/${profile.uid}`)) {
			await updateUser(profile.sponsorId, (sponsor) => ({
				...sponsor,
				walletBalance: sponsor.walletBalance + DIRECT_BONUS
			}));
			await rput(`/referrals/${profile.uid}`, {
				referrerId: profile.sponsorId,
				referredId: profile.uid,
				cookieTimestamp: now,
				bonusPaid: true,
				createdAt: now
			});
			await rput(`/walletTransactions/${profile.sponsorId}/ref_${profile.uid}`, {
				userId: profile.sponsorId,
				type: "referral_bonus",
				amount: DIRECT_BONUS,
				status: "posted",
				period: manilaPeriod(),
				note: `${profile.name} joined`,
				sourceUserId: profile.uid,
				createdAt: now
			});
			await rput(`/notifications/${profile.sponsorId}/ref_${profile.uid}`, {
				kind: "referral",
				title: `${peso(DIRECT_BONUS)} referral`,
				body: `${profile.name} joined with your link.`,
				read: false,
				createdAt: now
			});
		}
	}
	const next = await updateUser(profile.uid, (user) => ({
		...user,
		membershipStatus: "active",
		referralCode: code,
		joinDate: user.joinDate ?? now
	}));
	if (!await rget(`/unilevelTree/${profile.uid}`)) await rput(`/unilevelTree/${profile.uid}`, {
		userId: profile.uid,
		parentId: null,
		level: 0,
		children: {},
		ancestorIds: ""
	});
	await rput(`/payments/${profile.uid}/${now}`, {
		userId: profile.uid,
		amount: MEMBERSHIP_FEE,
		status: "recorded",
		gateway: "sponsor",
		gatewayRef: `sponsor_${now.toString(36)}`,
		method: "sponsor",
		timestamp: now
	});
	if (profile.sponsorId) await rpatch(`/bySponsor/${profile.sponsorId}/${profile.uid}`, {
		name: profile.name,
		membershipStatus: "active",
		placed: false
	});
	await rput(`/notifications/${profile.uid}/welcome`, {
		kind: "welcome",
		title: "Desk is open",
		body: "Membership is active. Today’s pick is waiting.",
		read: false,
		createdAt: now
	});
	await announceNewMember(next, (profile.sponsorId ? await rget(`/users/${profile.sponsorId}`) : null)?.name || "No sponsor");
	await seedTutorials();
	return next;
}
async function announceNewMember(member, sponsorName) {
	const users = await rget("/users");
	const roster = Object.values(users ?? {}).filter((user) => user?.uid && user.membershipStatus === "active");
	if (!roster.some((user) => user.uid === member.uid)) roster.push(member);
	const notice = {
		kind: "join",
		title: "New member",
		body: `${sponsorName} sponsored ${member.name}.`,
		read: false,
		createdAt: Date.now()
	};
	await Promise.all(roster.map((user) => rput(`/notifications/${user.uid}/join_${member.uid}`, notice)));
}
async function settle(uid) {
	const period = manilaPeriod();
	const raw = await rget(`/walletTransactions/${uid}`);
	let add = 0;
	await Promise.all(Object.entries(raw ?? {}).map(async ([id, tx]) => {
		if (tx.type === "unilevel" && tx.status === "scheduled" && tx.period < period) {
			await rpatch(`/walletTransactions/${uid}/${id}`, { status: "posted" });
			add += Number(tx.amount);
		}
	}));
	if (add > 0) await updateUser(uid, (user) => ({
		...user,
		walletBalance: user.walletBalance + add
	}));
}
async function loadWallet(idToken) {
	const profile = await requireUser(idToken);
	await settle(profile.uid);
	const fresh = await rget(`/users/${profile.uid}`) ?? profile;
	const txRaw = await rget(`/walletTransactions/${profile.uid}`);
	const transactions = Object.entries(txRaw ?? {}).map(([id, tx]) => ({
		...tx,
		id,
		amount: Number(tx.amount)
	})).sort((a, b) => b.createdAt - a.createdAt);
	const recruits = await rget(`/bySponsor/${profile.uid}`);
	const list = Object.values(recruits ?? {});
	const accruing = transactions.filter((tx) => tx.type === "unilevel" && tx.status === "scheduled").reduce((sum, tx) => sum + tx.amount, 0);
	const accumulated = transactions.filter((tx) => tx.type !== "payout" && tx.status !== "scheduled" && tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
	const pendingPayout = transactions.filter((tx) => tx.type === "payout" && tx.status === "requested").reduce((sum, tx) => sum + tx.amount, 0);
	return {
		profile: fresh,
		transactions,
		directPaid: list.filter((recruit) => recruit.membershipStatus === "active").length,
		directPending: list.filter((recruit) => recruit.membershipStatus !== "active").length,
		directBonus: transactions.filter((tx) => tx.type === "referral_bonus").reduce((sum, tx) => sum + tx.amount, 0),
		accruing,
		teamSize: await teamSize(profile.uid),
		accumulated,
		available: Math.max(0, Number(fresh.walletBalance) - pendingPayout),
		pendingPayout
	};
}
async function teamSize(uid) {
	const seen = /* @__PURE__ */ new Set();
	const queue = [uid];
	while (queue.length) {
		const current = queue.shift();
		if (!current || seen.has(current)) continue;
		seen.add(current);
		const node = await rget(`/unilevelTree/${current}`);
		for (const child of Object.keys(node?.children ?? {})) queue.push(child);
	}
	return Math.max(0, seen.size - 1);
}
function cleanPayoutAccount(input) {
	const accountName = input.accountName.trim().replace(/\s+/g, " ");
	if (accountName.length < 2) throw new Error("Enter the account name.");
	if (input.method === "gcash") {
		const account = input.account.replace(/\D/g, "");
		if (account.length < 10 || account.length > 16) throw new Error("Enter the GCash account number.");
		return {
			method: input.method,
			account,
			phone: account,
			accountName
		};
	}
	const account = input.account.replace(/\D/g, "");
	if (account.length < 10 || account.length > 16) throw new Error("Enter the Maya account number.");
	return {
		method: input.method,
		account,
		phone: account,
		accountName
	};
}
async function requestPayout(idToken, input) {
	const profile = await requireUser(idToken);
	if (profile.membershipStatus !== "active") throw new Error("Activate membership before requesting a payout.");
	if (input.amount < PAYOUT_MIN) throw new Error(`Minimum payout is ${peso(PAYOUT_MIN)}.`);
	const payoutMethod = cleanPayoutAccount(input);
	await settle(profile.uid);
	const fresh = await rget(`/users/${profile.uid}`) ?? profile;
	const txRaw = await rget(`/walletTransactions/${profile.uid}`);
	const pending = Object.values(txRaw ?? {}).filter((tx) => tx?.type === "payout" && tx.status === "requested").reduce((sum, tx) => sum + Number(tx.amount), 0);
	if (Number(fresh.walletBalance) - pending < input.amount) throw new Error("That is more than your available balance.");
	const next = await updateUser(profile.uid, (user) => ({
		...user,
		payoutMethod
	}));
	const now = Date.now();
	const requestId = `payout_${now}`;
	await rput(`/walletTransactions/${profile.uid}/${requestId}`, {
		userId: profile.uid,
		type: "payout",
		amount: input.amount,
		status: "requested",
		period: manilaPeriod(),
		note: `${payoutMethod.method === "gcash" ? "GCash" : "Maya"} payout requested. Not paid yet.`,
		sourceUserId: null,
		createdAt: now
	});
	await rput(`/payoutRequests/${requestId}`, {
		id: requestId,
		uid: profile.uid,
		name: profile.name,
		email: profile.email,
		amount: input.amount,
		method: payoutMethod.method,
		account: payoutMethod.account,
		phone: payoutMethod.phone,
		accountName: payoutMethod.accountName,
		status: "requested",
		createdAt: now,
		paidAt: null
	});
	await rput(`/notifications/${profile.uid}/${requestId}`, {
		kind: "payout",
		title: "Payout requested",
		body: `$${input.amount} is waiting for the admin to pay it. Your balance is unchanged.`,
		read: false,
		createdAt: now
	});
	return next;
}
async function listPayoutRequests(idToken) {
	const who = await verify(idToken);
	if (!isMasterEmail(who.email)) throw new Error("Only master@dailyconnect.tech can open payout requests.");
	const raw = await rget("/payoutRequests");
	return { requests: Object.values(raw ?? {}).sort((a, b) => b.createdAt - a.createdAt) };
}
async function markPayoutPaid(idToken, requestId) {
	const who = await verify(idToken);
	if (!isMasterEmail(who.email)) throw new Error("Only master@dailyconnect.tech can mark a payout paid.");
	if (!/^payout_\d+$/.test(requestId)) throw new Error("That payout request is not valid.");
	const request = await rget(`/payoutRequests/${requestId}`);
	if (!request) throw new Error("That payout request was not found.");
	if (request.status === "paid") return { requests: (await listPayoutRequests(idToken)).requests };
	await updateUser(request.uid, (user) => {
		if (user.walletBalance < request.amount) throw new Error("The balance is lower than this payout.");
		return {
			...user,
			walletBalance: user.walletBalance - request.amount
		};
	});
	const paidAt = Date.now();
	await rpatch(`/payoutRequests/${requestId}`, {
		status: "paid",
		paidAt
	});
	await rpatch(`/walletTransactions/${request.uid}/${requestId}`, {
		status: "paid",
		note: `${request.method === "gcash" ? "GCash" : "Maya"} payout paid.`
	});
	await rput(`/notifications/${request.uid}/${requestId}_paid`, {
		kind: "payout",
		title: "Payout paid",
		body: `$${request.amount} was paid to your ${request.method === "gcash" ? "GCash" : "Maya"} account.`,
		read: false,
		createdAt: paidAt
	});
	return listPayoutRequests(idToken);
}
async function buildTree(uid, depth) {
	const user = await rget(`/users/${uid}`);
	const node = await rget(`/unilevelTree/${uid}`);
	const childIds = Object.keys(node?.children ?? {});
	const children = depth >= 10 ? [] : await Promise.all(childIds.map((child) => buildTree(child, depth + 1)));
	return {
		uid,
		name: user?.name || "Member",
		level: node?.level ?? depth,
		children
	};
}
async function downline(uid) {
	const ids = /* @__PURE__ */ new Set();
	const queue = [uid];
	while (queue.length) {
		const current = queue.shift();
		if (!current || ids.has(current)) continue;
		ids.add(current);
		const node = await rget(`/unilevelTree/${current}`);
		for (const child of Object.keys(node?.children ?? {})) queue.push(child);
	}
	return ids;
}
async function loadNetwork(idToken) {
	const profile = await requireUser(idToken);
	const recruitRaw = await rget(`/bySponsor/${profile.uid}`);
	return {
		profile,
		recruits: Object.entries(recruitRaw ?? {}).map(([uid, recruit]) => ({
			...recruit,
			uid
		})),
		tree: await buildTree(profile.uid, 0)
	};
}
async function placeMember(input) {
	const sponsor = await requireMember(input.idToken);
	if (!uidOk(input.recruitUid) || !uidOk(input.parentUid)) throw new Error("That placement is not valid.");
	if (input.recruitUid === input.parentUid) throw new Error("A member cannot sit under themselves.");
	const recruit = await rget(`/users/${input.recruitUid}`);
	if (!recruit || recruit.sponsorId !== sponsor.uid) throw new Error("You can only place people who joined with your link.");
	if (recruit.membershipStatus !== "active") throw new Error("They need an active membership before placement.");
	if (recruit.placementParentId) throw new Error("They are already placed.");
	const allowed = await downline(sponsor.uid);
	if (!allowed.has(input.parentUid)) throw new Error("Place them under yourself or someone already in your line.");
	if (allowed.has(input.recruitUid)) throw new Error("They are already in the line.");
	const parent = await rget(`/unilevelTree/${input.parentUid}`);
	const parentLevel = parent?.level ?? 0;
	const chain = [...(parent?.ancestorIds ?? "").split(",").filter(Boolean), input.parentUid].slice(-10);
	const recruitNode = await rget(`/unilevelTree/${input.recruitUid}`) ?? {
		userId: input.recruitUid,
		parentId: null,
		level: 0,
		children: {},
		ancestorIds: ""
	};
	await rput(`/unilevelTree/${input.recruitUid}`, {
		...recruitNode,
		parentId: input.parentUid,
		level: parentLevel + 1,
		ancestorIds: chain.join(",")
	});
	await rpatch(`/unilevelTree/${input.parentUid}`, { children: {
		...parent?.children ?? {},
		[input.recruitUid]: true
	} });
	await rpatch(`/users/${input.recruitUid}`, { placementParentId: input.parentUid });
	await rpatch(`/bySponsor/${sponsor.uid}/${input.recruitUid}`, { placed: true });
	const period = manilaPeriod();
	const now = Date.now();
	await Promise.all(chain.map(async (ancestorId, index) => {
		const level = chain.length - index;
		await rput(`/walletTransactions/${ancestorId}/uni_${input.recruitUid}`, {
			userId: ancestorId,
			type: "unilevel",
			amount: LEVEL_BONUS,
			status: "scheduled",
			period,
			note: `Level ${level} from ${recruit.name}`,
			sourceUserId: input.recruitUid,
			createdAt: now
		});
		await rput(`/notifications/${ancestorId}/uni_${input.recruitUid}`, {
			kind: "unilevel",
			title: `${peso(LEVEL_BONUS)} unilevel scheduled`,
			body: `${recruit.name} was placed at level ${level}. It posts on the 1st.`,
			read: false,
			createdAt: now
		});
	}));
	return loadNetwork(input.idToken);
}
async function markNoticesRead(idToken) {
	const profile = await requireUser(idToken);
	const raw = await rget(`/notifications/${profile.uid}`);
	await Promise.all(Object.entries(raw ?? {}).filter(([, notice]) => !notice.read).map(([id]) => rpatch(`/notifications/${profile.uid}/${id}`, { read: true })));
	return noticesFor(profile.uid);
}
async function listNotices(idToken) {
	const notifications = await noticesFor((await requireUser(idToken)).uid);
	return {
		notifications,
		unread: notifications.filter((notice) => !notice.read).length
	};
}
//#endregion
export { ensureProfile, issueActivationCode, listIssuedCodes, listNotices, listPayoutRequests, listSponsorCodes, loadDesk, loadMySponsor, loadNetwork, loadProfile, loadSponsorCard, loadTutorial, loadWallet, markNoticesRead, markPayoutPaid, masterAccess, placeMember, postLedger, readUploadedVideo, redeemActivationCode, refresh, requestPayout, requireActiveMember, saveProgress, savePublicContact, signInWithEmail, signUpWithEmail };
