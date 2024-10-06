document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transferForm');
    const transferTypeInputs = document.querySelectorAll('input[name="transferType"]');
    const transferDetails = document.getElementById('transferDetails');

    // FIFA country codes for autocomplete
    const countries = ["ARG", "BRA", "ENG", "FRA", "GER", "ITA", "SPA", "POR", "NED", "USA", "JPN", "KOR"];

    transferTypeInputs.forEach(input => {
        input.addEventListener('change', generateFields);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        saveDataToGoogleSheet(Object.fromEntries(formData));
    });

    function generateFields() {
        const selectedType = document.querySelector('input[name="transferType"]:checked').value;
        let htmlContent = '';

        // Player Info Section
        htmlContent += `
            <section>
                <label for="playerName">Player Name:</label>
                <input type="text" id="playerName" name="playerName" required>

                <label for="playerAge">Player Age:</label>
                <input type="text" id="playerAge" name="playerAge" pattern="\\d+" required>

                <label for="playerNationality">Nationality:</label>
                <input type="text" id="playerNationality" name="playerNationality" list="countryCodes" required>
                <datalist id="countryCodes">${countries.map(country => `<option value="${country}">`).join('')}</datalist>

                <label for="overallRating">Overall Rating:</label>
                <input type="text" id="overallRating" name="overallRating" pattern="\\d+" required>
            </section>`;

        // Transaction Info Section based on type
        if (selectedType === "Transfer") {
            htmlContent += `
                <section>
                    <label for="transferFee">Transfer Fee (in million Euros):</label>
                    <input type="text" id="transferFee" name="transferFee" pattern="\\d+(\\.\\d{1,2})?" required>

                    <label for="feeIn">Fee In:</label>
                    <input type="text" id="feeIn" name="feeIn" pattern="\\d+(\\.\\d{1,2})?" required>

                    <label for="yearsAtClub">Years at Club:</label>
                    <input type="text" id="yearsAtClub" name="yearsAtClub" pattern="\\d+" required>

                    <label for="overallGrowth">Overall Growth (+ or -):</label>
                    <input type="text" id="overallGrowth" name="overallGrowth" pattern="[+-]\\d+" required>
                </section>`;
        } else if (selectedType === "Loan to Buy" || selectedType === "Loan") {
            htmlContent += `
                <section>
                    ${selectedType === "Loan to Buy" ? `
                    <label for="transferFee">Transfer Fee (in million Euros):</label>
                    <input type="text" id="transferFee" name="transferFee" pattern="\\d+(\\.\\d{1,2})?" required>
                    ` : ''}

                    <label for="loanLength">Loan Length:</label>
                    <select id="loanLength" name="loanLength" required>
                        <option value="6 months">6 months</option>
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                    </select>

                    <label for="contractRemaining">Contract Remaining:</label>
                    <input type="text" id="contractRemaining" name="contractRemaining" pattern="\\d" required>

                    <label for="wage">Wage (in thousand Euros):</label>
                    <input type="text" id="wage" name="wage" pattern="\\d+(\\.\\d{1,2})?" required>
                </section>`;
        }

        // Club Information Section
        htmlContent += `
            <section>
                <label for="clubName">Club Name:</label>
                <input type="text" id="clubName" name="clubName" required>

                <label for="clubNation">Club Nation:</label>
                <input type="text" id="clubNation" name="clubNation" list="countryCodes" required>

                <label for="clubTier">Club Tier:</label>
                <select id="clubTier" name="clubTier" required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </section>`;

        transferDetails.innerHTML = htmlContent;
    }

    generateFields(); // Generate initial fields

    function saveDataToGoogleSheet(data) {
    fetch('https://script.google.com/macros/s/AKfycbwpUrTlDeCQ3vprxBLsUqPQLb9B_5CeLu2ON7j2g4pV-eYBCIoIbbOHlsK6Rd8_YP3J/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.success) {
            alert('Data saved successfully!');
        } else {
            alert('Error saving data: ' + responseData.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    });
}
});
