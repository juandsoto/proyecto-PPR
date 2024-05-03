include "globals.mzn";

int: CANTIDAD_ESCENAS = (length(Escenas) div length(ACTORES)) - 1;

enum ACTORES;

array[1..length(ACTORES), int] of int: Escenas;

array[1..CANTIDAD_ESCENAS] of int: Duracion;

array[1..CANTIDAD_ESCENAS] of var 1..CANTIDAD_ESCENAS: orden_escenas; %= [i | i in 1..CANTIDAD_ESCENAS];

% Restricciones

constraint all_different(orden_escenas);

% Funciones

function var 1..CANTIDAD_ESCENAS: primera_escena(1..length(ACTORES): a)
  = min([i | i in 1..CANTIDAD_ESCENAS where Escenas[a, orden_escenas[i]] = 1]);
  
function var 1..CANTIDAD_ESCENAS: ultima_escena(1..length(ACTORES): a)
  = max([i | i in 1..CANTIDAD_ESCENAS where Escenas[a, orden_escenas[i]] = 1]);
  
function var int: calcular_costo(1..length(ACTORES): a)
  = sum(i in 1..CANTIDAD_ESCENAS)(

  if
    Escenas[a,orden_escenas[i]] = 1 \/
    (i >= primera_escena(a) /\
        i <= ultima_escena(a))
    then Duracion[orden_escenas[i]]
    else 0
  endif
) * Escenas[a,CANTIDAD_ESCENAS+1];

% Funcion objetivo

var int: costo;

constraint costo = sum(a in 1..length(ACTORES))(calcular_costo(a));

array[1..length(ACTORES)] of var int: costo_por_actor;

constraint costo_por_actor = [calcular_costo(a) | a in 1..length(ACTORES)];

%solve minimize costo;

solve satisfy;

output ["ESCENAS = \(orden_escenas)" ++ "\n\n" ++ "COSTO = \(costo)" ++ "\n\n"];

output ["Costo por actor: \(costo_por_actor)"];









