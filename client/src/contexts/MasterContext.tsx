import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { getAllBankName, getAllCitiesAPI, getAllCountriesAPI, getAllStatesAPI, getBankAccountType, requestHandler } from '../utils/api';

interface countryType {
    COUNTRY_CODE: string;
    COUNTRY_NAME: string;
}
interface bankType {
    BANK_CODE:string;
    BANK_DESC:string;
    ORDER_SL:string;
}
interface bankAccountType {
    ACNT_TYPE:string;
    ACNT_DESC:string;
}
interface stateType {
    COUNTRY_CODE: string;
    STATE_CODE: string;
    STATE_NAME: string;
}
interface cityType {
    STATE_CODE: string;
    CITY_CODE: string;
    CITY_NAME: string;
}

class MasterContextType {
    allCountries: countryType[] = [];
    allStates: stateType[] = [];
    allCities: cityType[] = [];
    bankName: bankType[]= [];
    bankAccType:bankAccountType[]= [];
    getCountries: () => void = () => {};
    getStates: (country_code: string) => void = () => {};
    getCities: (state_code: string) => void = () => {};
    GetAllBankName: () => void = () =>{};
    GetBankAccountType: () => void = () =>{};

}

const MasterContext = createContext<MasterContextType>(
    new MasterContextType()
);

export function useMaster() {
    return useContext(MasterContext);
  }

export function MasterProvider({ children }: { children: ReactNode }) {
    const [allCountries, setallCountries] = useState<countryType[]>([]);
    const [allStates, setallStates] = useState<stateType[]>([]);
    const [allCities, setallCities] = useState<cityType[]>([]);
    const [bankName, setbankName] = useState<bankType[]>([]);
    const [bankAccType, setbankAccType] = useState<bankAccountType[]>([]);

    const getCountries = () => {
        requestHandler(
            async () => {
                return await getAllCountriesAPI();
            },
            (data) => {
                if (data.success) {
                    setallCountries(data.data);
                }
            },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );
    };

    const getStates = (country_code : string) => {
        requestHandler(
            async () => {
                return await getAllStatesAPI(country_code);
            },
            (data) => {
                if (data.success) {
                    setallStates(data.data);
                }
            },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );
    };

    const getCities = (state_code : string) => {
        requestHandler(
            async () => {
                return await getAllCitiesAPI(state_code);
            },
            (data) => {
                if (data.success) {
                    setallCities(data.data);
                }
            },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );
    };
// bank master api's
    const GetAllBankName = () => {
        requestHandler(
            async () => {
                return await getAllBankName();
            },
            (data) => {
                if (data.success) {
                    setbankName(data.data);
                }
            },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );

    }

    const GetBankAccountType = () => {
        requestHandler(
            async () => {
                return await getBankAccountType();
            },
            (data) => {
                if (data.success) {
                    setbankAccType(data.data);
                }
            },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );

    }

    useEffect(() => {
        getCountries();
    }, [])


    useEffect(() => {
     GetAllBankName();
     GetBankAccountType();
    }, [])
    
    

    const value : MasterContextType = {allCountries , allStates , allCities , bankName , bankAccType , getCountries , getStates , getCities , GetAllBankName,GetBankAccountType() {
        
    },};

    return (
        <MasterContext.Provider value={value}>
            {children}
        </MasterContext.Provider>
    );
}
