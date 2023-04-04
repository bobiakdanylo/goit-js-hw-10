import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const selInput = document.getElementById('search-box');
const selList = document.querySelector('.country-list');
const selInfo = document.querySelector('.country-info');
const clearForm = ref => (ref.innerHTML = '');
const inputhHandler = e => {
    const textInput = e.target.value.trim();
    
    if(!textInput){
        clearForm(selList);
        clearForm(selInfo);
        return;
    };

    fetchCountries(textInput)
    .then(data => {
        console.log(data);
        if(data.length > 10){
            Notify.info('Too many matches found. Please enter a more specific name');
            return;
        }
        renderMarkup(data)
    })
    .catch(err => {
        clearForm(selList);
        clearForm(selInfo);
        Notify.failure('Oops, there is no country with that name');
    }); 
};
const renderMarkup = data => {
    if(data.length === 1){
        clearForm(selList);
        const infoMarkup = createInfoMarkup(data);
        selInfo.innerHTML = infoMarkup;
    }else{
        clearForm(selInfo);
        const listMarkup = createListMarkup(data);
        selList.innerHTML = listMarkup;
    }
};
const createListMarkup = data => {
    return data
    .map(({name, flags}) => `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`,)
    .join('');
};
const createInfoMarkup = data => {
    return data
    .map(({ name, capital, population, flags, languages }) => 
    `<h1><img src="${flags.png}" alt="${name.official}" width="40" height="40">${
        name.official
      }</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`,
      );
};
selInput.addEventListener('input', debounce(inputhHandler, DEBOUNCE_DELAY));  