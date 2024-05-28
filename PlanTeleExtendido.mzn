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
    if Escenas[a,orden_escenas[i]] = 1 \/ (i >= primera_escena(a) /\ i <= ultima_escena(a))
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
    if i >= max(primera_escena(actor_a),primera_escena(actor_b)) /\
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

solve minimize costo + evitar;

output [show(orden_escenas)]++["\n\n"]
++["Tiempo compartido: \(Evitar[i,1]),\(Evitar[i,2]) = \(tiempo_compartido[i]) \n" | i in 1..E]++["\n"]
++["Tiempo Total: \(evitar)\n"]
++["Costo: \(costo) \n"]
++["Costo por actor: \(costo_por_actor) \n"];