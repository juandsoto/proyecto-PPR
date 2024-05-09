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
array[1..CANTIDAD_ACTORES, int] of 0..infinity: Escenas;

% Unidades de tiempo que duran las escenas.
array[1..CANTIDAD_ESCENAS] of 0..infinity: Duracion;

% Disponibilidad de los actores: este array muestra si los actores definen un máximo limite de tiempo en el que pueden estar en el set:
% Si Maximo_tiempo_actores[a] = 0 entonces el actor tiene disponible todo el tiempo, es decir, no impone restricciones de tiempo.
% Si Maximo_tiempo_actores[a] > 0, entonces el actor solo tiene disponible ciertas unidades de tiempo para estar en el set.
array[1..CANTIDAD_ACTORES] of 0..sum(Duracion): Maximo_tiempo_actores;

% Número de parejas de actores que prefieren evitar estar juntos durante la grabación.
0..infinity: CANTIDAD_PAREJAS;

% Vector que muestra cuales actores deben estar separados en lo posible, debido a que juntos no trabajan tan bien.
array[int,int] of 1..CANTIDAD_ACTORES: Actores_separados;

% Estos son los pesos que se le asignan al costo y tiempo en que algunos actores no deberían estar juntos.
% c_weight -> este es el peso que se le da al costo
% t_weight -> este es el peso que se le da al tiempo que comparten los actores que no trabajan bien juntos.
0.0..1.0: c_weight;
0.0..1.0: t_weight;

% ====================================================================================================================
% Variables
% ====================================================================================================================

% Vector que revela el orden en que se deben mostrar las escenas
array[1..CANTIDAD_ESCENAS] of var 1..CANTIDAD_ESCENAS: orden_escenas; %= [i | i in 1..CANTIDAD_ESCENAS];

% Representa el costo total de la producción, calculado como la suma de los costos individuales de cada actor. En otras palabras, este es el costo de la solución.
var 0.0..infinity: costo;

% Almacena los costos individuales de cada actor en un array. Este arreglo es útil para ver cuanto cobra en total cada actor, por ejemplo en costo_por_actor[1] está el precio que cobra el actor 1 por estar en el set durante cierto intervalo de tiempo.
array[1..CANTIDAD_ACTORES] of var int: costo_por_actor;

% array que muestra el tiempo en que permanecen juntos los autores que deberían estar separados.
array[int] of var int: tiempo_juntos = [ let { 
  % Recuperamos los indices de los actores.
  int: actor1 = Actores_separados[a,1];
  int: actor2 = Actores_separados[a,2];
  % Recuperamos las escenas donde participan los actores.
  var set of int: escenas_autor_1 = { orden_escenas[i] | i in 1..CANTIDAD_ESCENAS where i >= primera_escena(actor1, orden_escenas) /\ i <= ultima_escena(actor1, orden_escenas) };
  var set of int: escenas_autor_2 = { orden_escenas[i] | i in 1..CANTIDAD_ESCENAS where i >= primera_escena(actor2, orden_escenas) /\ i <= ultima_escena(actor2, orden_escenas) };
  % Intersectamos las escenas, para hallar las escenas que tienen en común
  var set of int: escenas_en_comun = escenas_autor_1 intersect escenas_autor_2;
  array[1..CANTIDAD_ESCENAS] of var opt 1..CANTIDAD_ESCENAS: escenas_comun = [ e | e in escenas_en_comun ];
} in
sum(i in 1..length(escenas_comun))(Duracion[escenas_comun[i]]) | a in 1..length(Actores_separados) div 2
];

% ====================================================================================================================
% Restricciones
% ====================================================================================================================

% --------------------------------------------------------------------------------------------------------------------
% Restricciones del problema
% --------------------------------------------------------------------------------------------------------------------

% Restricción: No se pueden repetir escenas en el vector de orden.
constraint all_different(orden_escenas);

% Restricción: si el actor a es una estrella y exige un limite de tiempo para quedarse en el set, dicho limite hay que respetarselo.
constraint forall(a in 1..CANTIDAD_ACTORES) (
  Maximo_tiempo_actores[a] > 0 /\ primera_escena(a, orden_escenas) != -1 -> 
  sum(i in 1..CANTIDAD_ESCENAS where i >= primera_escena(a, orden_escenas) /\ i <= ultima_escena(a, orden_escenas) /\ Escenas[a, orden_escenas[i]] = 1)(Duracion[orden_escenas[i]]) <= Maximo_tiempo_actores[a]
);

% --------------------------------------------------------------------------------------------------------------------
% Restricciones redundantes
% --------------------------------------------------------------------------------------------------------------------

% Restricción: la suma de los indices de las escenas debe ser inferior o igual a la suma de los numeros del 1 hasta la cantidad de escenas.
constraint sum(orden_escenas) <= sum(i in 1..CANTIDAD_ESCENAS)(i);

% Restricción: los actores pueden permanecer juntos en el set en todas las escenas a lo máximo.
constraint forall (t in 1..CANTIDAD_PAREJAS) (
  tiempo_juntos[t] >= 0 /\ tiempo_juntos[t] <= duracion_todas_las_escenas
);

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

% Restricción: el orden de las escenas, no puede estar invertido.
% Esto se traduce en que el array orden_escenas debe ser menor lexicográficamente que su inverso.
constraint lex_less(orden_escenas, reverse(orden_escenas));

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

% Restringe la variable costo para que sea igual a la suma de los costos individuales de cada actor, calculados mediante la función calcular_costo(a).
constraint costo = sum(a in 1..CANTIDAD_ACTORES)(calcular_costo(a));

% Restringe el array costo_por_actor para que contenga los costos individuales de cada actor, calculados mediante la función calcular_costo(a). 
constraint costo_por_actor = [calcular_costo(a) | a in 1..CANTIDAD_ACTORES];

% El peor tiempo que pueden estar juntos 2 actores: la sumatoria de la duración de cada escena.
int: duracion_todas_las_escenas = sum(Duracion);

% El peor costo posible: todos los actores deben estar en todas las escenas, por tanto, cobrar por todo ese tiempo.
int: peor_costo = sum(a in 1..CANTIDAD_ACTORES) (duracion_todas_las_escenas * Escenas[a, CANTIDAD_ESCENAS+1]);

% Total del tiempo en que permanecen juntos los actores que deberían estar separados.
var int: tiempo_juntos_total = sum(tiempo_juntos);

% Función objetivo:
% ( ( costo / peor_costo ) * c_weight ) + ( ( tiempo_juntos_total / duracion_todas_las_escenas ) * t_weight );

% solve minimize costo;
% solve minimize tiempo_juntos_total;
solve minimize ( ( costo / peor_costo ) * c_weight ) + ( ( tiempo_juntos_total / duracion_todas_las_escenas ) * t_weight );
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

% Arreglo que muestra cuanto tiempo estuvieron en el set los actores.
array[1..CANTIDAD_ACTORES] of var 0..sum(Duracion): tiempo_consumido_por_actores = [
  sum(i in 1..CANTIDAD_ESCENAS where i >= primera_escena(a, orden_escenas) /\ i <= ultima_escena(a, orden_escenas) /\ Escenas[a, orden_escenas[i]] = 1)(Duracion[orden_escenas[i]]) | a in 1..CANTIDAD_ACTORES
];

output ["ESCENAS = \(orden_escenas)" ++ "\n\n" ++ "COSTO = \(costo)" ++ "\n\n"];

output ["Costo por actor: \(costo_por_actor)" ++ "\n\n"];

output ["Tiempo por actor: \(tiempo_consumido_por_actores)" ++ "\n\n"];

output ["Tiempo en que trabajan juntos los actores que se deben separar: " ++ show(tiempo_juntos) ++ "\n\n"];









