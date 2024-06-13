import { useEffect } from "react";

function Multiselect({name, allOptions, current, setCurrent, orig, showChanges}) {

	function equalContents(arr1, arr2) {
		if (arr1 == null || arr2 == null) {
			return false;
		}
		if (arr1.length !== arr2.length) {
			return false;
		}
		for (let i = 0; i < arr1.length; i++) {
			if (!(arr1.includes(arr2[i]) && arr2.includes(arr1[i]))) {
				return false;
			}
		}
		return true;
	}

	function addRemoveTag(tag, current, setCurrent) {
		if (current.includes(tag)) {
			const index = current.indexOf(tag);
			const temp = current;
			temp.splice(index, 1);
			setCurrent(temp);
			document.getElementById(tag.replace(" ", "-")).style.backgroundColor = null;
		} else {
			const temp = current;
			temp.push(tag);
			setCurrent(temp);
			document.getElementById(tag.replace(" ", "-")).style.backgroundColor = "#77AD78";
		}

		if (showChanges) {
			console.log("showing changes between the following")
			console.log(orig);
			console.log(current)
			if (!equalContents(orig, current)) {
				document.getElementById(name + "-span").style.backgroundColor = "#EED202";
			}
			else {
				document.getElementById(name + "-span").style.backgroundColor = null;
			}
		}
	}

	useEffect(() => {
		allOptions.forEach(opt => document.getElementById(opt.replace(" ", "-")).style.backgroundColor = null);
		current.forEach(opt => document.getElementById(opt.replace(" ", "-")).style.backgroundColor = "#77AD78")
	}, [current, allOptions]);

	return (
		<div className="input-group mb-3">
			<span className='input-group-text' id={name + "-span"}>{name}</span>
			<div className='form-control select-tag-options'>
				{allOptions.map(opt => (
					<div className="select-tag" id={opt.replace(" ", "-")} key={opt.replace(" ", "-")} onClick={() => addRemoveTag(opt, current, setCurrent)}>
						{opt}
					</div>
				))}
			</div>
		</div>
	)
}

export default Multiselect