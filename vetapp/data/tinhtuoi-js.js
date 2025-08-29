const ageTableDog = {
            'small': [15, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100],
            'medium': [15, 24, 28, 32, 36, 42, 47, 51, 56, 60, 65, 69, 74, 78, 83, 87, 92, 96],
            'large': [15, 24, 28, 32, 36, 45, 52, 59, 65, 71, 78, 84, 89, 96, 100]
        };

        const ageTableCat = {
            1: 15, 2: 24, 3: 28, 4: 32, 5: 36, 6: 40, 7: 44, 8: 48, 9: 52, 10: 56,
            11: 60, 12: 64, 13: 68, 14: 72, 15: 76, 16: 80, 17: 84, 18: 88, 19: 92, 20: 96
        };

        // Hàm chung để hiển thị kết quả
        function showResult(resultDiv, textContent) {
            resultDiv.textContent = textContent;
            resultDiv.classList.remove('hidden');
        }

        // Hàm tính toán tuổi chó theo công thức
        function calculateAgeFromFormula() {
            const dogAge = document.getElementById('dogAgeFormula').value;
            const resultDiv = document.getElementById('result-formula');
            const maxAge = 31;

            if (dogAge > 0 && dogAge <= maxAge) {
                const age = parseFloat(dogAge);
                const humanAge = 16 * Math.log(age) + 31;
                const roundedAge = Math.round(humanAge);
                showResult(resultDiv, `Tuổi của chó tương đương ${roundedAge} tuổi người.`);
            } else {
                showResult(resultDiv, `Vui lòng nhập một số từ 1 đến ${maxAge}.`);
            }
        }

        // Hàm tính toán tuổi chó theo bảng quy đổi
        function calculateAgeFromTable() {
            const dogAge = parseInt(document.getElementById('dogAgeTable').value);
            const dogSize = document.getElementById('dogSize').value;
            const resultDiv = document.getElementById('result-table');
            const maxAge = ageTableDog[dogSize].length;

            if (dogAge >= 1 && dogAge <= maxAge) {
                const humanAge = ageTableDog[dogSize][dogAge - 1];
                showResult(resultDiv, `Tuổi của chó tương đương ${humanAge} tuổi người.`);
            } else {
                showResult(resultDiv, `Vui lòng nhập tuổi từ 1 đến ${maxAge}.`);
            }
        }

        // Hàm tính toán tuổi mèo theo bảng quy đổi
        function calculateCatAge() {
            const catAge = parseInt(document.getElementById('catAgeTable').value);
            const resultDiv = document.getElementById('result-cat');
            const maxAge = 20;

            if (catAge > 0 && catAge <= maxAge) {
                const humanAge = ageTableCat[catAge];
                showResult(resultDiv, `Tuổi của mèo tương đương ${humanAge} tuổi người.`);
            } else {
                showResult(resultDiv, `Vui lòng nhập tuổi từ 1 đến ${maxAge}.`);
            }
        }
