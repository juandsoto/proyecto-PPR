export const BASIC_MODEL = `
include "globals.mzn";

% ====================================================================================================================
% Parametros
% ====================================================================================================================

% Cantidad de actores
1..infinity: N;

% Nombres de los actores
enum ACTORES;

% Cantidad de escenas
1..infinity: M;

% Matriz para determinar si el actor a participó en la escena i
% La última columna indica lo que cobra cada actor (en cientos de miles) por cada unidad de tiempo que le toque estar en el estudio.
array[ACTORES, 1..M+1] of 0..infinity: Escenas;

% Unidades de tiempo que duran las escenas.
array[1..M] of 1..infinity: Duracion;

% ====================================================================================================================
% Variables
% ====================================================================================================================

% Vector que revela el orden en que se deben mostrar las escenas
array[1..M] of var 1..M: orden_escenas;

% Representa el costo total de la producción, calculado como la suma de los costos individuales de cada actor. En otras palabras, este es el costo de la solución.
var int: costo;

% Almacena los costos individuales de cada actor en un array. Este arreglo es útil para ver cuanto cobra en total cada actor, por ejemplo en costo_por_actor[1] está el precio que cobra el actor 1 por estar en el set durante cierto intervalo de tiempo.
array[ACTORES] of var int: costo_por_actor;

% ====================================================================================================================
% Restricciones
% ====================================================================================================================

% --------------------------------------------------------------------------------------------------------------------
% Restricciones del problema
% --------------------------------------------------------------------------------------------------------------------

% Restricción: No se pueden repetir escenas en el vector de orden.
constraint all_different(orden_escenas);

% --------------------------------------------------------------------------------------------------------------------
% Restricciones redundantes
% --------------------------------------------------------------------------------------------------------------------

% Restricción: la suma de los indices de las escenas debe ser inferior o igual a la suma de los numeros del 1 hasta la cantidad de escenas.
constraint sum(orden_escenas) <= M * (M + 1) / 2;

% --------------------------------------------------------------------------------------------------------------------
% Restricciones de simetría
% --------------------------------------------------------------------------------------------------------------------

% Restricción: si en la escena i actuan los mismos actores que en la escena j, se ordenan ascendentemente en el arreglo orden_escenas.
constraint forall(i in 1..M-1) (
  forall(j in i+1..M) (
    forall(a in ACTORES) (      
      Escenas[a, orden_escenas[i]] = Escenas[a, orden_escenas[j]]
    ) -> orden_escenas[i] < orden_escenas[j]
  )
);

% ====================================================================================================================
% Funciones auxiliares
% ====================================================================================================================

% Función: Devuelve el índice de la primera escena en la que el actor a participa.
% Si devuelve -1, quiere decir que el actor no participó en ninguna escena.
function var -1..M: primera_escena(ACTORES: a)
  = let { 
    array[int] of var opt int: escenas_donde_actor_participa = [i | i in 1..M where Escenas[a, orden_escenas[i]] = 1];
  } 
  in 
  if length(escenas_donde_actor_participa) > 0 
    then min(escenas_donde_actor_participa)
    else -1
  endif;
  
% Función: Devuelve el índice de la última escena en la que el actor a participa.
% Si devuelve -1, quiere decir que el actor no participó en ninguna escena.
function var -1..M: ultima_escena(ACTORES: a)
  = let { 
    array[int] of var opt int: escenas_donde_actor_participa = [i | i in 1..M where Escenas[a, orden_escenas[i]] = 1];
  } 
  in 
  if length(escenas_donde_actor_participa) > 0 
    then max(escenas_donde_actor_participa)
    else -1
  endif;
  
% Función: Calcula el costo total para el actor a considerando la duración de cada escena en la que participa, multiplicada por la duración de la escena.
function var int: calcular_costo(ACTORES: a)
  = let {
    var int: primera_escena = primera_escena(a);
    var int: ultima_escena = ultima_escena(a);
  }
  in
  sum(i in 1..M)(

  if
    Escenas[a,orden_escenas[i]] = 1 \\/
      (i >= primera_escena /\\ i <= ultima_escena)
    then Duracion[orden_escenas[i]]
    else 0
  endif
) * Escenas[a,M+1];

% ====================================================================================================================
% Funcion objetivo y Estrategia de búsqueda
% ====================================================================================================================

% Restringe el array costo_por_actor para que contenga los costos individuales de cada actor, calculados mediante la función calcular_costo(a).
constraint costo_por_actor = [calcular_costo(a) | a in ACTORES];

% Restringe la variable costo para que sea igual a la suma de los costos individuales de cada actor, calculados mediante la función calcular_costo(a).
constraint costo = sum(a in ACTORES)(costo_por_actor[a]);

% función objetivo:
% sum(a in 1..N)(calcular_costo(a))

%solve minimize costo;

%solve :: int_search(orden_escenas, first_fail, indomain_min) minimize costo;
%Profundidad: 6, Azules-Nodos: 22, Rojo-Fallidos: 21, Verde-Solución factible: 2
%solve :: int_search(orden_escenas, input_order, indomain_min) minimize costo;
%Profundidad: 6, Azules-Nodos: 22, Rojo-Fallidos: 21, Verde-Solución factible: 2
solve :: int_search(orden_escenas, anti_first_fail, indomain_min) minimize costo;
%Profundidad: 6, Azules-Nodos: 14, Rojo-Fallidos: 13, Verde-Solución factible: 2
%solve :: int_search(orden_escenas, smallest, indomain_min) minimize costo;
%Profundidad: 6, Azules-Nodos: 22, Rojo-Fallidos: 21, Verde-Solución factible: 2
%solve :: int_search(orden_escenas, largest, indomain_min) minimize costo;
%Profundidad: 6, Azules-Nodos: 22, Rojo-Fallidos: 21, Verde-Solución factible: 2

% solve satisfy;

% ====================================================================================================================
% Salida
% ====================================================================================================================

% Estas restricciones sirven para mostrar la informacion en la interfaz
array[1..N] of var ACTORES: actores;
array[1..M] of var int: duracion;
array[1..N] of var int: costo_hora;
array[1..N, 1..M] of var int: escenas;

constraint actores = [a | a in ACTORES];
constraint duracion = [d | d in Duracion];
constraint costo_hora = [Escenas[a,M+1] | a in ACTORES];
constraint forall(i in ACTORES, j in 1..M) (
  escenas[i,j] = Escenas[i,j]
);
`;

export const EXTENDED_MODEL = `
include "globals.mzn";

%Parámetros

int: N; %Número de actores
int: M; %Numero de escenas
int: E; %Numero de parejas de actores que se evitan

enum ACTORES;
array[ACTORES, 1..M+1] of int: Escenas;
array[1..M] of int: Duracion;
array[1..N, 1..2] of int: Disponibilidad;
array[1..E, 1..2] of ACTORES: Evitar;

%Auxiliar: Arreglo que contiene el costo por hora de cada actor
array[ACTORES] of int: COSTO = [Escenas[a,M+1] | a in ACTORES];

%Variable: Contiene el orden final de las escenas
array[1..M] of var 1..M: orden_escenas;
%Variable: Contiene los costos totales por actor
array[ACTORES] of var int: costo_por_actor;
%Variable: Contiene la sumatoria de los costos totales de cada actor
var int: costo;
%Variable: Contiene el tiempo que comparte cada pareja de actores en la lista Evitar
array[1..E] of var int: tiempo_compartido;

%Funcion: Devuelve el índice de la primera escena en la que el actor a participa.
%Si devuelve -1, quiere decir que el actor no participó en ninguna escena.
function var -1..M: primera_escena(ACTORES: a)
  = let { 
    array[int] of var opt int: escenas_donde_actor_participa =
      [i | i in 1..M where Escenas[a, orden_escenas[i]] = 1];
  } 
  in 
  if length(escenas_donde_actor_participa) > 0 
  then min(escenas_donde_actor_participa)
  else -1
  endif;
  
%Funcion: Devuelve el índice de la última escena en la que el actor a participa.
%Si devuelve -1, quiere decir que el actor no participó en ninguna escena.
function var -1..M: ultima_escena(ACTORES: a) =
  let { 
    array[int] of var opt int: escenas_donde_actor_participa =
      [i | i in 1..M where Escenas[a, orden_escenas[i]] = 1];
  } 
  in 
  if length(escenas_donde_actor_participa) > 0 
    then max(escenas_donde_actor_participa)
    else -1
  endif;
  
%Funcion: Cantidad de tiempo que estará un actor en el set
function var int: duracion_en_set(ACTORES: a) = 
  (sum(i in 1..M)(
    if Escenas[a,orden_escenas[i]] = 1 \\/ (i >= primera_escena(a) /\\ i <= ultima_escena(a))
      then Duracion[orden_escenas[i]]
      else 0
    endif));

%Funcion: Multiplica lo que cobra un actor por la duracion que está en set
function var int: calcular_costo(ACTORES: a) = (duracion_en_set(a) * COSTO[a]);
                           
constraint costo_por_actor = [calcular_costo(a) | a in ACTORES];
constraint costo = sum(a in ACTORES)(costo_por_actor[a]);

constraint tiempo_compartido = [
  let {
    ACTORES: actor_a = ACTORES[Evitar[j,1]];
    ACTORES: actor_b = ACTORES[Evitar[j,2]];
  }
  in
  sum(i in 1..M)(
    if i >= max(primera_escena(actor_a),primera_escena(actor_b)) /\\
        i <= min(ultima_escena(actor_a),ultima_escena(actor_b))
      then Duracion[orden_escenas[i]]
      else 0
    endif) | j in 1..E
];

%Sumatoria de las unidades de tiempo que comparten en set cada pareja de actores que esta en la lista evitar                    
var int: evitar = sum(i in 1..E)(tiempo_compartido[i]); 

%Restricciones

%Las escenas no se pueden repetir
constraint all_different(orden_escenas);                       

%Pone limite a las unidades de tiempo que un actor puede estar en el set de acuerdo al parametro Disponibilidad.
%Si la disponibilidad es 0, significa que no hay limite de tiempo para el actor
constraint forall(i in 1..N)
                  (if Disponibilidad[i,2] = 0
                    then true
                    else duracion_en_set(ACTORES[Disponibilidad[i,1]]) <= Disponibilidad[i,2]
                  endif);        

% Estas restricciones sirven para mostrar la informacion en la interfaz
array[1..N] of var ACTORES: actores;
array[1..M] of var int: duracion;
array[1..N] of var int: costo_hora;
array[ACTORES, 1..M] of var int: escenas;
array[1..N] of var int: disponibilidad;
array[1..E, 1..2] of var ACTORES: evitan;

constraint actores = [a | a in ACTORES];
constraint duracion = [d | d in Duracion];
constraint costo_hora = [Escenas[a,M+1] | a in ACTORES];
constraint forall(i in ACTORES, j in 1..M) (
  escenas[i,j] = Escenas[i,j]
);
constraint forall(i in 1..N) (
  disponibilidad[i] = Disponibilidad[i,2]
);
constraint forall(i in 1..E, j in 1..2) (
  evitan[i,j] = Evitar[i,j]
);

solve minimize costo + evitar;
`;