const target = document.querySelector('h1')

window.addEventListener('resize', () => {

	getFontSize(target);
	
});

const getFontSize = (item)=> 
{
	let compStyles = window.getComputedStyle(item);

	const printFontSize = document.querySelector('.print-font-size')
	printFontSize.textContent = compStyles.getPropertyValue('font-size') ;
}

getFontSize(target)



