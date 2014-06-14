// This function progresses the simulation by dt seconds using
// the Runge-Kutta method
void StepSimulation(float dt) {
  float     F;     // total force
  float     A;     // acceleration
  float     Vnew;  // new velocity at time t + dt
  float     Snew;  // new position at time t + dt
  float     k1, k2, k3, k4;
  F = (T - (C * V));
  A = F / M;
  k1 = dt * A;
  F = (T - (C * (V + k1 / 2)));
  A = F / M;
  k2 = dt * A;
  F = (T - (C * (V + k2 / 2)));
  A = F / M;
  k3 = dt * A;
  F = (T - (C * (V + k3)));
  A = F / M;
  k4 = dt * A;
  // Calculate the new velocity at time t + dt
  // where V is the velocity at time t
  Vnew = V + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
  // Calculate the new displacement at time t + dt
  // where S is the displacement at time t
  Snew = S + Vnew * dt;
  // Update old velocity and displacement with the new ones
  V = Vnew;
  S = Snew;
}
