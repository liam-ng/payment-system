const searchParams = new URLSearchParams(window.location.search);
// const planID = searchParams.get('planID');
$('input[name=planID]').val(searchParams.get('planID'));
console.log($('input[name=planID]').val);

