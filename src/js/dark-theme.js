
// если сайт с переключателем темы вставить в html input

/*
<label >
  <input type="checkbox" name="theme" id="darck-theme">
</label>
*/


(function () {

    const checkBox = document.querySelector('input[name="theme"]');
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    checkBox.setAttribute('checked', isDark );
        if( isDark ){
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    checkBox.addEventListener('input',function()
    {
        if(this.checked){
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        else{
            document.documentElement.setAttribute('data-theme', 'light');
        }
    })

}());


// если сайт без переключателя оставить этот код , другой удалить

// (function () {
    
//     const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     if( isDark ){
//         document.documentElement.setAttribute('data-theme', 'dark');
//     }
//     else{
//         document.documentElement.setAttribute('data-theme', 'light');
//     }
// }());














