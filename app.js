class UnitConverter {

    static Init() {
        UnitConverter.Conversions = [{
                inputUnit: 'Km',
                resultUnit: 'miles',
                multiplier: 0.621371
            },
            {
                inputUnit: 'miles',
                resultUnit: 'Km',
                multiplier: 1.609344
            },
            {
                inputUnit: 'feet',
                resultUnit: 'metres',
                multiplier: 0.304878
            },
            {
                inputUnit: 'metres',
                resultUnit: 'feet',
                multiplier: 3.281
            },
            {
                inputUnit: 'cm',
                resultUnit: 'inches',
                multiplier: 0.393701
            },
            {
                inputUnit: 'inches',
                resultUnit: 'cm',
                multiplier: 2.539998
            }
        ];

        UnitConverter.select = document.getElementById('unitsSelect');
        UnitConverter.invertBtn = document.getElementById('invertBtn');
        UnitConverter.input = document.getElementById('unitsInput');
        UnitConverter.inputLabel = document.getElementById('unitsInputLabel');
        UnitConverter.resultNum = document.getElementById('resultNum');
        UnitConverter.resultUnits = document.getElementById('resultUnits');
        UnitConverter.saveBtn = document.getElementById('saveBtn');

        // Add events listeners
        UnitConverter.select.addEventListener('change', UnitConverter.UpdateConversion);
        UnitConverter.input.addEventListener('input', UnitConverter.UpdateConversion);
        UnitConverter.invertBtn.addEventListener('click', UnitConverter.InvertConversion);
        UnitConverter.saveBtn.addEventListener('click', UnitConverter.SaveConversion);

        UnitConverter.RenderSavedConversions();
    }

    static UpdateConversion() {
        const index = document.getElementById('unitsSelect').value;
        const SelectedConversion = UnitConverter.Conversions[index];


        UnitConverter.inputLabel.innerText = SelectedConversion.inputUnit;
        const Value = UnitConverter.input.value;

        const Result = (Value * SelectedConversion.multiplier).toFixed(2);
        UnitConverter.resultNum.innerText = Result;
        UnitConverter.resultUnits.innerText = SelectedConversion.resultUnit;

    }

    static InvertConversion() {
        const currentIndex = parseFloat(document.getElementById('unitsSelect').value);
        const newIndex = (currentIndex % 2 == 0) ? currentIndex + 1 : currentIndex - 1;
        const currentResult = UnitConverter.resultNum.innerText;

        let options = document.querySelectorAll('#unitsSelect option');
        options[newIndex].selected = true;

        UnitConverter.input.value = currentResult;
        UnitConverter.UpdateConversion();
    }

    static SaveConversion() {
        let conversions = JSON.parse(localStorage.getItem('conversions'));
        if (!conversions)
            conversions = [];

        const index = document.getElementById('unitsSelect').value;
        const SelectedConversion = UnitConverter.Conversions[index];
        const conversion = {
            id: conversions.length + 1,
            inputUnit: SelectedConversion.inputUnit,
            resultUnit: SelectedConversion.resultUnit,
            value: UnitConverter.input.value,
            result: UnitConverter.resultNum.innerText
        }

        // Add to localStorage
        conversions.push(conversion);
        localStorage.setItem('conversions', JSON.stringify(conversions));

        // Add to DOM
        let savedConversion = new SavedConversion(
            conversion.id,
            conversion.inputUnit,
            conversion.resultUnit,
            conversion.value,
            conversion.result,
        );
        let savedConversionView = new SavedConversionView();
        let savedConversionController = new SavedConversionController(savedConversion, savedConversionView);

        // Reset inputs
        UnitConverter.input.value = 0;
        UnitConverter.UpdateConversion();
    }

    static RenderSavedConversions() {
        let conversions = JSON.parse(localStorage.getItem('conversions'));

        if (!conversions)
            conversions = [];

        for (let i = 0; i < conversions.length; i++) {
            const conversion = conversions[i];

            // Add to DOM
            let savedConversion = new SavedConversion(
                conversion.id,
                conversion.inputUnit,
                conversion.resultUnit,
                conversion.value,
                conversion.result,
            );
            let savedConversionView = new SavedConversionView();
            let savedConversionController = new SavedConversionController(savedConversion, savedConversionView);

        }
    }
}

class SavedConversion {
    constructor(
        id,
        inputUnit,
        resultUnit,
        value,
        result,
    ) {
        this.id = id;
        this.inputUnit = inputUnit;
        this.resultUnit = resultUnit;
        this.value = value;
        this.result = result;
    }
}

class SavedConversionView {
    constructor() {
        this.item = SavedConversionView.savedConvertionPrototype.cloneNode(true);
        this.item.removeAttribute('id');

        this.inputUnit = this.item.querySelector('.saved-input-unit');
        this.value = this.item.querySelector('.saved-input');
        this.resultUnit = this.item.querySelector('.saved-result-unit');
        this.result = this.item.querySelector('.saved-result');
        this.deleteBtn = this.item.querySelector('.deleteBtn');
    }
    static Init() {
        SavedConversionView.savedConvertionPrototype = document.getElementById('savedConvertionPrototype');
        SavedConversionView.container = document.getElementById('savedConvertionsList');
    }

    populate(savedConversion) {
        this.inputUnit.innerText = savedConversion.inputUnit;
        this.value.innerText = savedConversion.value;
        this.resultUnit.innerText = savedConversion.resultUnit;
        this.result.innerText = savedConversion.result;

        SavedConversionView.container.appendChild(this.item);
    }
}

class SavedConversionController {
    constructor(savedConversion, savedConversionView) {
        this.savedConversion = savedConversion;
        this.savedConversionView = savedConversionView;

        savedConversionView.populate(savedConversion);

        // Add events listeners
        this.savedConversionView.deleteBtn.addEventListener('click', this.delete.bind(this));


    }

    delete() {
        // Delete from LocalStorage
        let conversions = JSON.parse(localStorage.getItem('conversions'));

        if (!conversions || conversions.length == 0) return;

        const index = conversions.findIndex((conver) => conver.id == this.savedConversion.id);
        conversions.splice(index, 1);

        localStorage.setItem('conversions', JSON.stringify(conversions));

        // Delete from DOM
        this.savedConversionView.item.remove();
    }
}

window.addEventListener('load', () => {
    SavedConversionView.Init();
    UnitConverter.Init();
});