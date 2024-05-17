include "globals.mzn";

% ====================================================================================================================
% Parametros
% ====================================================================================================================

% Cantidad de actores
1..infinity: CANTIDAD_ACTORES;

% Nombres de los actores
enum ACTORES;

% Cantidad de escenas
1..infinity: CANTIDAD_ESCENAS;

% Matriz para determinar si el actor a participó en la escena i
% La última columna indica lo que cobra cada actor (en cientos de miles) por cada unidad de tiempo que le toque estar en el estudio.
array[1..CANTIDAD_ACTORES, 1..CANTIDAD_ESCENAS+1] of 0..infinity: Escenas;

% Unidades de tiempo que duran las escenas.
array[1..CANTIDAD_ESCENAS] of 1..infinity: Duracion;

% ====================================================================================================================
% Variables
% ====================================================================================================================

% Vector que revela el orden en que se deben mostrar las escenas
array[1..CANTIDAD_ESCENAS] of var 1..CANTIDAD_ESCENAS: orden_escenas;

% Representa el costo total de la producción, calculado como la suma de los costos individuales de cada actor. En otras palabras, este es el costo de la solución.
var int: costo;

% Almacena los costos individuales de cada actor en un array. Este arreglo es útil para ver cuanto cobra en total cada actor, por ejemplo en costo_por_actor[1] está el precio que cobra el actor 1 por estar en el set durante cierto intervalo de tiempo.
array[1..CANTIDAD_ACTORES] of var int: costo_por_actor;

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
constraint sum(orden_escenas) <= CANTIDAD_ESCENAS * (CANTIDAD_ESCENAS + 1) / 2;

% --------------------------------------------------------------------------------------------------------------------
% Restricciones de simetría
% --------------------------------------------------------------------------------------------------------------------

% Restricción: si en la escena i actuan los mismos actores que en la escena j, se ordenan ascendentemente en el arreglo orden_escenas.
constraint forall(i in 1..CANTIDAD_ESCENAS-1) (
  forall(j in i+1..CANTIDAD_ESCENAS) (
    forall(a in 1..CANTIDAD_ACTORES) (      
      Escenas[a, orden_escenas[i]] = Escenas[a, orden_escenas[j]]
    ) -> orden_escenas[i] < orden_escenas[j]
  )
);

% ====================================================================================================================
% Funciones auxiliares
% ====================================================================================================================

% Función: Devuelve el índice de la primera escena en la que el actor a participa.
% Si devuelve -1, quiere decir que el actor no participó en ninguna escena.
function var -1..CANTIDAD_ESCENAS: primera_escena(1..CANTIDAD_ACTORES: a, array[1..CANTIDAD_ESCENAS] of var 1..CANTIDAD_ESCENAS: orden_escenas)
  = let { 
    array[int] of var opt int: escenas_donde_autor_participa = [i | i in 1..CANTIDAD_ESCENAS where Escenas[a, orden_escenas[i]] = 1];
  } 
  in 
  if length(escenas_donde_autor_participa) > 0 
  then min(escenas_donde_autor_participa)
  else -1
  endif;
  
% Función: Devuelve el índice de la última escena en la que el actor a participa.
% Si devuelve -1, quiere decir que el actor no participó en ninguna escena.
function var -1..CANTIDAD_ESCENAS: ultima_escena(1..CANTIDAD_ACTORES: a, array[1..CANTIDAD_ESCENAS] of var 1..CANTIDAD_ESCENAS: orden_escenas)
  = let { 
    array[int] of var opt int: escenas_donde_autor_participa = [i | i in 1..CANTIDAD_ESCENAS where Escenas[a, orden_escenas[i]] = 1];
  } 
  in 
  if length(escenas_donde_autor_participa) > 0 
  then max(escenas_donde_autor_participa)
  else -1
  endif;
  
% Función: Calcula el costo total para el actor a considerando la duración de cada escena en la que participa, multiplicada por la duración de la escena.
function var int: calcular_costo(1..CANTIDAD_ACTORES: a)
  = sum(i in 1..CANTIDAD_ESCENAS)(

  if
    Escenas[a,orden_escenas[i]] = 1 \/
    (i >= primera_escena(a, orden_escenas) /\
        i <= ultima_escena(a, orden_escenas))
    then Duracion[orden_escenas[i]]
    else 0
  endif
) * Escenas[a,CANTIDAD_ESCENAS+1];

% ====================================================================================================================
% Funcion objetivo y Estrategia de búsqueda
% ====================================================================================================================

% Restringe el array costo_por_actor para que contenga los costos individuales de cada actor, calculados mediante la función calcular_costo(a).
constraint costo_por_actor = [calcular_costo(a) | a in 1..CANTIDAD_ACTORES];

% Restringe la variable costo para que sea igual a la suma de los costos individuales de cada actor, calculados mediante la función calcular_costo(a).
constraint costo = sum(a in 1..CANTIDAD_ACTORES)(costo_por_actor[a]);

% función objetivo:
% sum(a in 1..CANTIDAD_ACTORES)(calcular_costo(a))

solve minimize costo;

% solve satisfy;

% ====================================================================================================================
% Salida
% ====================================================================================================================

% Estas restricciones sirven para mostrar la informacion en la interfaz
array[1..CANTIDAD_ACTORES] of var ACTORES: actores;
array[1..CANTIDAD_ESCENAS] of var int: duracion;
array[1..CANTIDAD_ACTORES] of var int: costo_hora;
array[1..CANTIDAD_ACTORES, 1..CANTIDAD_ESCENAS] of var int: escenas;

constraint actores = [a | a in ACTORES];
constraint duracion = [d | d in Duracion];
constraint costo_hora = [Escenas[a,CANTIDAD_ESCENAS+1] | a in 1..CANTIDAD_ACTORES];
constraint forall(i in 1..CANTIDAD_ACTORES, j in 1..CANTIDAD_ESCENAS) (
  escenas[i,j] = Escenas[i,j]
);

output ["ESCENAS = \(orden_escenas)" ++ "\n\n" ++ "COSTO = \(costo)" ++ "\n\n"];

output ["Costo por actor: \(costo_por_actor)"];









