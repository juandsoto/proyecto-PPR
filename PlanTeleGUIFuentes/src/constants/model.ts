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
array[1..N, int] of 0..infinity: Escenas;

% Unidades de tiempo que duran las escenas.
array[1..M] of 1..infinity: Duracion;

% Disponibilidad de los actores: este array muestra si los actores definen un máximo limite de tiempo en el que pueden estar en el set:
% Si Maximo_tiempo_actores[a] = 0 entonces el actor tiene disponible todo el tiempo, es decir, no impone restricciones de tiempo.
% Si Maximo_tiempo_actores[a] > 0, entonces el actor solo tiene disponible ciertas unidades de tiempo para estar en el set.
array[1..N] of 0..sum(Duracion): Maximo_tiempo_actores;

% Número de parejas de actores que prefieren evitar estar juntos durante la grabación.
0..infinity: E;

% Vector que muestra cuales actores deben estar separados en lo posible, debido a que juntos no trabajan tan bien.
array[1..E, 1..2] of 1..N: Actores_separados;

% Estos son los pesos que se le asignan al costo y tiempo en que algunos actores no deberían estar juntos.
% c_weight -> este es el peso que se le da al costo
% t_weight -> este es el peso que se le da al tiempo que comparten los actores que no trabajan bien juntos.
0.0..1.0: c_weight;
0.0..1.0: t_weight;

% ====================================================================================================================
% Variables
% ====================================================================================================================

% Vector que revela el orden en que se deben mostrar las escenas
array[1..M] of var 1..M: orden_escenas; %= [i | i in 1..M];

% Representa el costo total de la producción, calculado como la suma de los costos individuales de cada actor. En otras palabras, este es el costo de la solución.
var 0.0..infinity: costo;

% Almacena los costos individuales de cada actor en un array. Este arreglo es útil para ver cuanto cobra en total cada actor, por ejemplo en costo_por_actor[1] está el precio que cobra el actor 1 por estar en el set durante cierto intervalo de tiempo.
array[1..N] of var int: costo_por_actor;
array[1..E] of var int: tiempo_juntos;

int: numero_parejas = if E = 0 then 1 else E endif;

% array que muestra el tiempo en que permanecen juntos los autores que deberían estar separados.
constraint tiempo_juntos = [ let { 
  % Recuperamos los indices de los actores.
  int: actor1 = Actores_separados[a,1];
  int: actor2 = Actores_separados[a,2];
  % Recuperamos las escenas donde participan los actores.
  var set of int: escenas_autor_1 = { orden_escenas[i] | i in 1..M where i >= primera_escena(actor1, orden_escenas) /\\ i <= ultima_escena(actor1, orden_escenas) };
  var set of int: escenas_autor_2 = { orden_escenas[i] | i in 1..M where i >= primera_escena(actor2, orden_escenas) /\\ i <= ultima_escena(actor2, orden_escenas) };
  % Intersectamos las escenas, para hallar las escenas que tienen en común
  var set of int: escenas_en_comun = escenas_autor_1 intersect escenas_autor_2;
  array[1..M] of var opt 1..M: escenas_comun = [ e | e in escenas_en_comun ];
} in
sum(i in 1..length(escenas_comun))(Duracion[escenas_comun[i]]) | a in 1..E
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
constraint forall(a in 1..N) (
  Maximo_tiempo_actores[a] > 0 /\\ primera_escena(a, orden_escenas) != -1 -> 
  sum(i in 1..M where i >= primera_escena(a, orden_escenas) /\\ i <= ultima_escena(a, orden_escenas))(
    Duracion[orden_escenas[i]]) <= Maximo_tiempo_actores[a]
);

% --------------------------------------------------------------------------------------------------------------------
% Restricciones redundantes
% --------------------------------------------------------------------------------------------------------------------

% Restricción: la suma de los indices de las escenas debe ser inferior o igual a la suma de los numeros del 1 hasta la cantidad de escenas.
constraint sum(orden_escenas) <= M * (M + 1) / 2;

% Restricción: los actores pueden permanecer juntos en el set en todas las escenas a lo máximo.
constraint forall (t in 1..E) (
  tiempo_juntos[t] >= 0 /\\ tiempo_juntos[t] <= duracion_todas_las_escenas
);

% --------------------------------------------------------------------------------------------------------------------
% Restricciones de simetría
% --------------------------------------------------------------------------------------------------------------------

% Restricción: si en la escena i actuan los mismos actores que en la escena j, se ordenan ascendentemente en el arreglo orden_escenas.
constraint forall(i in 1..M-1) (
  forall(j in i+1..M) (
    forall(a in 1..N) (      
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
function var -1..M: primera_escena(1..N: a, array[1..M] of var 1..M: orden_escenas)
  = let { 
    array[int] of var opt int: escenas_donde_autor_participa = [i | i in 1..M where Escenas[a, orden_escenas[i]] = 1];
  } 
  in 
  if length(escenas_donde_autor_participa) > 0 
  then min(escenas_donde_autor_participa)
  else -1
  endif;
  
% Función: Devuelve el índice de la última escena en la que el actor a participa.
% Si devuelve -1, quiere decir que el actor no participó en ninguna escena.
function var -1..M: ultima_escena(1..N: a, array[1..M] of var 1..M: orden_escenas)
  = let { 
    array[int] of var opt int: escenas_donde_autor_participa = [i | i in 1..M where Escenas[a, orden_escenas[i]] = 1];
  } 
  in 
  if length(escenas_donde_autor_participa) > 0 
  then max(escenas_donde_autor_participa)
  else -1
  endif;
  
% Función: Calcula el costo total para el actor a considerando la duración de cada escena en la que participa, multiplicada por la duración de la escena.
function var int: calcular_costo(1..N: a)
  = sum(i in 1..M)(

  if
    Escenas[a,orden_escenas[i]] = 1 \\/
    (i >= primera_escena(a, orden_escenas) /\\
        i <= ultima_escena(a, orden_escenas))
    then Duracion[orden_escenas[i]]
    else 0
  endif
) * Escenas[a,M+1];

% ====================================================================================================================
% Funcion objetivo y Estrategia de búsqueda
% ====================================================================================================================

% Restringe la variable costo para que sea igual a la suma de los costos individuales de cada actor, calculados mediante la función calcular_costo(a).
constraint costo = sum(a in 1..N)(calcular_costo(a));

% Restringe el array costo_por_actor para que contenga los costos individuales de cada actor, calculados mediante la función calcular_costo(a). 
constraint costo_por_actor = [calcular_costo(a) | a in 1..N];

% El peor tiempo que pueden estar juntos 2 actores: la sumatoria de la duración de cada escena.
int: duracion_todas_las_escenas = sum(Duracion);

% El peor costo posible: todos los actores deben estar en todas las escenas, por tanto, cobrar por todo ese tiempo.
int: peor_costo = sum(a in 1..N) (duracion_todas_las_escenas * Escenas[a, M+1]);

% Total del tiempo en que permanecen juntos los actores que deberían estar separados.
var int: tiempo_juntos_total = sum(tiempo_juntos);

% Función objetivo:
var float: objetivo = ( ( costo / peor_costo ) * c_weight ) + ( ( tiempo_juntos_total / ( duracion_todas_las_escenas * numero_parejas ) ) * t_weight );

solve :: int_search(orden_escenas, first_fail, indomain_min) minimize objetivo;
%solve :: int_search(orden_escenas, input_order, indomain_min) minimize objetivo;
%solve :: int_search(orden_escenas, anti_first_fail, indomain_min) minimize objetivo;
%solve :: int_search(orden_escenas, smallest, indomain_min) minimize objetivo;
%solve :: int_search(orden_escenas, largest, indomain_min) minimize objetivo;

% solve satisfy;;

% ====================================================================================================================
% Salida
% ====================================================================================================================

% Estas restricciones sirven para mostrar la informacion en la interfaz
array[1..N] of var ACTORES: actores;
array[1..M] of var int: duracion;
array[1..N] of var int: costo_hora;
array[1..N, 1..M] of var int: escenas;
array[1..N] of var int: disponibilidad;
array[1..E, 1..2] of var ACTORES: evitan;

constraint actores = [a | a in ACTORES];
constraint duracion = [d | d in Duracion];
constraint costo_hora = [Escenas[a,M+1] | a in 1..N];
constraint forall(i in 1..N, j in 1..M) (
  escenas[i,j] = Escenas[i,j]
);
constraint forall(i in 1..N) (
  disponibilidad[i] = Maximo_tiempo_actores[i]
);
constraint forall(i in 1..E, j in 1..2) (
  evitan[i,j] = ACTORES[Actores_separados[i,j]]
);

% Arreglo que muestra cuanto tiempo estuvieron en el set los actores.
array[1..N] of var 0..sum(Duracion): tiempo_consumido_por_actores = [
  sum(i in 1..M where i >= primera_escena(a, orden_escenas) /\\ i <= ultima_escena(a, orden_escenas))(Duracion[orden_escenas[i]]) | a in 1..N
];
`;

export const EXTENDED_MODEL_V2 = `
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
array[1..E] of var int: tiempo_juntos;

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

constraint tiempo_juntos = [
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
var int: evitar = sum(i in 1..E)(tiempo_juntos[i]); 

%Restricciones

%Las escenas no se pueden repetir
constraint all_different(orden_escenas);      

% Restricción simetría: si en la escena i actuan los mismos actores que en la escena j, se ordenan ascendentemente en el arreglo orden_escenas.
constraint forall(i in 1..M-1) (
  forall(j in i+1..M) (
    forall(a in ACTORES) (      
      Escenas[a, orden_escenas[i]] = Escenas[a, orden_escenas[j]]
    ) -> orden_escenas[i] < orden_escenas[j]
  )
);
 

% Restricción simetría: el orden de las escenas, no puede estar invertido.
% Esto se traduce en que el array orden_escenas debe ser menor lexicográficamente que su inverso.
constraint lex_less(orden_escenas, reverse(orden_escenas));                

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

solve minimize 9*costo + evitar;
`;