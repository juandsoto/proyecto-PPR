Programación por restricciones - Proyecto Final

Implementación de problemas de optimización en MiniZinc

-Brayan Stiven Acuña Vanegas (201940805)
-Juan Sebastián Estupiñán Cifuentes (201924846)
-David Alberto Guzman Ardila (201942789)
-Juan David Soto Carmona (201958813)

Universidad del Valle, Ingeniería de Sistemas - Semestre X

Contenidos:

- En la carpeta raíz se encuentran los archivos .mzn de cada uno de los modelos: PlanTeleBasico.mzn y PlanTeleExtendido.mzn. También se encuentra el archivo PlanTeleExtendidoV2.mzn el cual es otra alternativa para resolver el problema extendido.

- En la carpeta datos se encuentran los archivos con los datos de entrada. Para el modelo básico los archivos tienen esta nomenclatura: PlanTeleBasico<identificador_prueba>.dzn o PlanTeleBasico<identificador_prueba>.ptb.
Para el modelo extendido los datos de entrada tienen esta nomenclatura: PlanTeleExtendido<identificador_prueba>.dzn o PlanTeleExtendido<identificador_prueba>.pte.

Por otra parte, dentro de datos, en la carpeta PlanTeleExtendidoV2, se encuentran los archivos con los datos de entrada para el modelo extendido V2.

- En la carpeta PlanTeleGUIFuentes se encuentra el código fuente de la aplicación. 


Instrucciones de compilación y ejecución:
1. Dirigirse hacia la carpeta PlanTeleGUIFuentes:
cd PlanTeleGUIFuentes
2. Instalar dependencias:
npm install
3. Ejecutar la aplicación:
npm run dev
4. En el navegador ir a localhost:5173 para usar la aplicación.