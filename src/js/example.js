const abc = document.querySelector('body')

window.addEventListener('resize', () => {

	getFontSize(abc);
	
});




const getFontSize = (item)=> 
{
	let compStyles = window.getComputedStyle(item);

	const printFontSize = document.querySelector('.print-font-size')
	printFontSize.textContent = compStyles.getPropertyValue('font-size') ;
}

getFontSize(abc)



