function SelectImg({name, options, current, setCurrent}) {

    function select(tag) {
        if (document.getElementById(current.name.replace(" ", "-"))) {
            document.getElementById(current.name.replace(" ", "-")).style.backgroundColor = null;
        }
        setCurrent(tag);
        document.getElementById(tag.name.replace(" ", "-")).style.backgroundColor = "#77AD78";
    }

    return (
        <div className="input-group mb-3">
			<span className='input-group-text' id={name + "-span"}>{name}</span>
			<div className='form-control select-tag-options'>
				{options.map(opt => (
					<figure className="select-tag" id={opt.name.replace(" ", "-")} key={opt.name.replace(" ", "-")} onClick={() => select(opt)}>
						<img className="event-image" style={{height: "6.25em", width: "6.25em"}} src={opt.link} alt=''/>
                        <figcaption style={{textAlign: 'center'}}>{opt.name}</figcaption>
					</figure>
				))}
                <div className='input-group mb-3'>
                    <span className='input-group-text' id="other">Other</span>
                    <input
                        className='form-control'
                        type='text'
                        onChange={(e) => select({name: 'other', link: e.target.value})}
                        placeholder='Family Night'
                    />
                </div>
			</div>
		</div>
    )
}

export default SelectImg;