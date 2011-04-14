var atiIns = 0;

function changeStyleByName(name,attrib,value) {
		var tags = document.getElementsByName(name);
		for(var i=0;i < tags.length;i++)
		{
			eval('tags[i].style.'+attrib+'="'+value+'";');
		} 
}


function getconfig() {

	for (i in G_prefs) {
		if (!getPref(i,G_prefs[i][0])) setPref(i,G_prefs[i][0],G_prefs[i][1]);
		else G_prefs[i][1] = getPref(i,G_prefs[i][0]);
	}

	// Add ATI translations if preferred
	if (G_prefs['ctrans'] && typeof(atiD) == 'undefined' && atiIns == 0) {
		if (G_prefs['catioff']) { 
			var nsrc = 'file://' + getHomePath().replace(/\\/g, '/') +'/'+ G_prefs['catiloc'] + '/html/tech/digital_pali_reader_suttas.js';
		}
		else { var nsrc = 'http://www.accesstoinsight.org/tech/digital_pali_reader_suttas.php'; }
		atiIns = 1;
		var headID = document.getElementsByTagName("head")[0];         
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.src = nsrc;
		headID.appendChild(newScript);
	}
	

	// update backgrounds
		
	checkbackground();
	checkcpbkg();

	// update fonts, colors

	document.styleSheets[0]['cssRules'][0].style.color = G_prefs['coltext']; 
	document.styleSheets[0]['cssRules'][0].style.fontFamily = G_prefs['colfont']; 
	document.styleSheets[0]['cssRules'][1].style.fontSize = G_prefs['colsize'] + 'px'; 
	
	document.styleSheets[0]['cssRules'][2].style.fontSize = Math.round(parseInt(G_prefs['colsize'])*.9) + 'px';  // select, etc.
	document.styleSheets[0]['cssRules'][2].style.backgroundColor = G_prefs['colinput'];  // select, etc.
	
	document.styleSheets[0]['cssRules'][3].style.fontSize = Math.round(parseInt(G_prefs['colsize'])*.8) + 'px';  // small
	document.styleSheets[0]['cssRules'][4].style.fontSize = Math.round(parseInt(G_prefs['colsize'])*.7) + 'px';  // tiny
	document.styleSheets[0]['cssRules'][5].style.fontSize = Math.round(parseInt(G_prefs['colsize'])*1.25) + 'px';  // large
	document.styleSheets[0]['cssRules'][6].style.fontSize = Math.round(parseInt(G_prefs['colsize'])*1.5) + 'px';  // huge
	
	document.styleSheets[0]['cssRules'][9].style.backgroundColor = G_prefs['colbkcp'];  // buttons
	document.styleSheets[0]['cssRules'][10].style.backgroundImage = '-moz-radial-gradient('+G_prefs['colbutton']+','+G_prefs['colbkcp']+')';  // buttons
	document.styleSheets[0]['cssRules'][11].style.backgroundImage = '-moz-radial-gradient('+G_prefs['colbutton']+','+G_prefs['colbkcp']+')';  // buttons
}

function changecss(myclass,element,value) {
	var CSSRules
	if (document.all) {
		CSSRules = 'rules'
	}
	else if (document.getElementById) {
		CSSRules = 'cssRules'
	}
	for (var i = 0; i < document.styleSheets[0][CSSRules].length; i++) {
		if (document.styleSheets[0][CSSRules][i].selectorText == myclass) {
			document.styleSheets[0][CSSRules][i].style[element] = value
		}
	}	
}

function checkbackground(x) {
	if (x==1) { 
		var colort = document.getElementById('colbk').value; 
		var bkgimg = document.getElementById('bkgimg').checked; 
	}
	else { 
		var colort = G_prefs['colbk']; 
		var bkgimg = G_prefs['bkgimg']; 
	}
	var bkgurl = (bkgimg ? 'url(chrome://digitalpalireader/content/images/background.png)' : '');

	document.styleSheets[0]['cssRules'][7].style.backgroundImage = bkgurl;  // paperback
	document.styleSheets[0]['cssRules'][7].style.backgroundColor = colort;  // paperback

	document.body.style.backgroundColor = colort;



}

function checkcpbkg(x) {
	if (x==1) { 
		var colort = document.getElementById('colbkcp').value 
		document.getElementById('confanf').style.backgroundColor = colort;
		document.getElementById('confcpf').style.backgroundColor = colort;
	}
	else { var colort = G_prefs['colbkcp'] }

	document.styleSheets[0]['cssRules'][8].style.backgroundImage = '-moz-linear-gradient(left,'+colort+',white,'+colort+')';  // chromeback
}

function saveOptions() {
	
	if(document.miscform.catioff.checked && !fileExists(document.miscform.catiloc.value,'start.html')) {
		alertFlash('Unrecognized local directory for ATI.  Please disable offline translations before saving preferences.','red'); 
		return; 
	}
	
	var Val;
	var Pref;
	for (i = 0; i < cPrefs.length; i++) {
		Pref = cPrefs[i];
		if (document.getElementById(Pref)) {
			Val = document.getElementById(Pref).value;
			if (Val) {
				setColPref(Pref,Val);
			}
		}
	}
	for (i = 0; i < sPrefs.length; i++) {
		Pref = sPrefs[i];
		if (document.getElementById(Pref)) {
			Val = document.getElementById(Pref).value;
			if (Val) {
				Val = checksizes(Pref,Val);
				setSizePref(Pref,Val);
			}
		}
	}
	for (i = 0; i < mPrefs.length; i++) {
		Pref = mPrefs[i];
		if (document.getElementById(Pref)) {
			if (document.getElementById(Pref).type=='checkbox') {
				Val = document.getElementById(Pref).checked;
				if (Val == true) Val = 'checked';
				if (Val == false) Val = 'unchecked';
			}
			else Val = document.getElementById(Pref).value;
			setMiscPref(Pref,Val);
		}
	}
	alertFlash("Options saved.",'green');
	moveframex(2);
	atiIns = 0; // in case we have to load a new ATI - it will still check for atiD
	getconfig();
}

function checksizes(pref,size) {

	var winW = window.innerWidth;
	var winH = window.innerHeight;
	switch (pref) {
		case 'ControlW':
			if (size < 80) { return 80; }
			if (size > (winW - 200)) { return (winW-200); }
			break;
		case 'AnalyzeH':
			if (size < 20) { return 20; }
			if (size > (winH - parseInt(confmove[1])-200)) { return (winH - parseInt(confmove[1]) - 200); }
			break;
		case 'DictH':
			if (size < 40) { return 40; }
			if (size > (winH - parseInt(confmove[0])-200)) { return (winH - parseInt(confmove[0]) - 200); }
			break;
		}
	return parseInt(size);
}

function eraseOptions(which) {
	
	var yes = confirm('Are you sure you want to reset all options?');
	
	if(!yes) return;
	
	for (i = 0; i < cPrefs.length; i++) {
		var Pref = cPrefs[i];
		var Val = cPrefVals[i];
		setColPref(Pref,Val);
	}
	for (i = 0; i < sPrefs.length; i++) {
		var Pref = sPrefs[i];
		var Val = sPrefVals[i];
		setSizePref(Pref,Val);
	}
	for (i = 0; i < mPrefs.length; i++) {
		var Pref = mPrefs[i];
		var Val = mPrefVals[i];
		setMiscPref(Pref,Val);
	}
	getconfig();
	if (which) {
		loadOptions();
		alertFlash("Options reset.",'green');
		moveframex(2);
	}
	else { refreshit(1); }
}

