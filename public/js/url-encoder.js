window.addEventListener('load', () => {
	let urlForm = document.getElementById('url-form');
	let resultText = document.getElementById('result-text');
	let destInput = document.getElementById('dest-input');
	let slugInput = document.getElementById('slug-input');

	urlForm.onsubmit = (e) => {
		e.preventDefault();

		const body = {
			slug: slugInput.value,
			dest: destInput.value,
		};

		const request = new Request('/store', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: new Headers({
				'Content-Type': 'application/json',
			}),
		});

		fetch(request).then(async (response) => {
			result = await response.json();
			console.log(result);
			if (result.success) {
				resultText.innerHTML = 'Successfully registered URL!';
			} else {
				resultText.innerHTML = 'Failed to register URL...';
			}
		});
	};
});
